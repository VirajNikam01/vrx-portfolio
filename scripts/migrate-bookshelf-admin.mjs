import fs from "node:fs";
import { createHash } from "node:crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

// Verify manually applied 0008–0010 before recording their history. Do not replay
// table creation over existing content or mark an unverified schema as migrated.
const client = postgres(process.env.DATABASE_URL, { prepare: false, max: 1, connect_timeout: 10 });
const journal = JSON.parse(fs.readFileSync("drizzle/meta/_journal.json", "utf8"));
const snapshot = JSON.parse(fs.readFileSync("drizzle/meta/0010_snapshot.json", "utf8"));
const normalizeType = type => ({ bigserial: "bigint", serial: "integer", timestamp: "timestamp without time zone" })[type] ?? type;
const normalizeSql = value => String(value).replace(/"|public\.|\s|::(?:text\[\]|jsonb)/g, "").toLowerCase();
try {
    await client.begin(async tx => {
        await tx.unsafe("select pg_advisory_xact_lock(hashtext('vrx-bookshelf-migration-baseline'))");
        const applied = await tx.unsafe("select created_at from drizzle.__drizzle_migrations");
        const times = new Set(applied.map(row => Number(row.created_at)));
        const pending = journal.entries.filter(entry => entry.idx >= 8 && entry.idx <= 10 && !times.has(entry.when));
        if (!pending.length) return;
        if (Math.max(...times) !== journal.entries.find(entry => entry.idx === 7).when) throw new Error("Unexpected migration history; reconcile manually");
        for (const table of Object.values(snapshot.tables)) {
            const columns = await tx.unsafe("select a.attname as name, format_type(a.atttypid,a.atttypmod) as type, a.attnotnull as not_null, pg_get_expr(d.adbin,d.adrelid) as default_value from pg_attribute a join pg_class c on c.oid=a.attrelid join pg_namespace n on n.oid=c.relnamespace left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum where n.nspname='public' and c.relname=$1 and a.attnum>0 and not a.attisdropped", [table.name]);
            for (const expected of Object.values(table.columns)) {
                const actual = columns.find(column => column.name === expected.name);
                if (!actual || actual.type !== normalizeType(expected.type) || actual.not_null !== expected.notNull) throw new Error(`Schema mismatch: ${table.name}.${expected.name}`);
                if (expected.default !== undefined && normalizeSql(actual.default_value) !== normalizeSql(expected.default)) throw new Error(`Default mismatch: ${table.name}.${expected.name}`);
            }
            const indexes = await tx.unsafe("select indexname as name, indexdef as definition from pg_indexes where schemaname='public' and tablename=$1", [table.name]);
            for (const [name, expected] of Object.entries(table.indexes)) {
                const actual = indexes.find(index => index.name === name);
                if (!actual || !expected.columns.every(column => normalizeSql(actual.definition).includes(normalizeSql(column.expression)))) throw new Error(`Index mismatch: ${name}`);
            }
            const constraints = await tx.unsafe("select con.conname as name, pg_get_constraintdef(con.oid) as definition from pg_constraint con join pg_class c on c.oid=con.conrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname=$1", [table.name]);
            for (const expected of Object.values(table.uniqueConstraints)) {
                const actual = constraints.find(constraint => constraint.name === expected.name);
                if (!actual || !normalizeSql(actual.definition).includes(normalizeSql(`unique(${expected.columns.join(",")})`))) throw new Error(`Unique constraint mismatch: ${expected.name}`);
            }
            for (const expected of Object.values(table.foreignKeys)) {
                const matches = constraint => normalizeSql(constraint.definition).includes(normalizeSql(`foreign key(${expected.columnsFrom.join(",")})`))
                    && normalizeSql(constraint.definition).includes(normalizeSql(`references ${expected.tableTo}(${expected.columnsTo.join(",")})`))
                    && (expected.onDelete === "no action" || normalizeSql(constraint.definition).includes(normalizeSql(`on delete ${expected.onDelete}`)));
                const actual = constraints.find(constraint => constraint.name === expected.name) ?? constraints.find(matches);
                if (!actual || !matches(actual)) throw new Error(`Foreign key mismatch: ${expected.name}`);
                if (actual.name !== expected.name) {
                    const quote = value => `"${value.replaceAll('"', '""')}"`;
                    await tx.unsafe(`alter table public.${quote(table.name)} rename constraint ${quote(actual.name)} to ${quote(expected.name)}`);
                }
            }
            const primary = Object.values(table.columns).filter(column => column.primaryKey).map(column => column.name);
            if (primary.length && !constraints.some(constraint => normalizeSql(constraint.definition) === normalizeSql(`primary key(${primary.join(",")})`))) throw new Error(`Primary key mismatch: ${table.name}`);
        }
        for (const expected of Object.values(snapshot.enums)) {
            const values = await tx.unsafe("select e.enumlabel from pg_enum e join pg_type t on t.oid=e.enumtypid join pg_namespace n on n.oid=t.typnamespace where n.nspname='public' and t.typname=$1 order by e.enumsortorder", [expected.name]);
            if (JSON.stringify(values.map(value => value.enumlabel)) !== JSON.stringify(expected.values)) throw new Error(`Enum mismatch: ${expected.name}`);
        }
        for (const entry of pending) {
            const hash = createHash("sha256").update(fs.readFileSync(`drizzle/${entry.tag}.sql`, "utf8")).digest("hex");
            await tx.unsafe("insert into drizzle.__drizzle_migrations (hash,created_at) values ($1,$2)", [hash, entry.when]);
        }
        console.log("Verified existing schema and reconciled migration records 0008–0010.");
    });
    await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
    console.log("Admin schema migration completed. Existing content was preserved.");
} catch (error) {
    console.error(error.message?.match(/^(Schema|Default|Index|Unique|Foreign|Primary|Enum|Unexpected)/) ? error.message : `Migration failed (${error.code ?? error.cause?.code ?? "database error"}).`);
    process.exitCode = 1;
} finally { await client.end({ timeout: 2 }); }
