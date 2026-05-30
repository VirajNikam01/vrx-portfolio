import { sql } from "drizzle-orm";
import {
    boolean,
    bigserial,
    check,
    index,
    integer,
    pgTable,
    text,
    timestamp,
    unique,
} from "drizzle-orm/pg-core";

import { jsonRecord } from "./shared";

export const designConfigs = pgTable(
    "design_configs",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        key: text("key").notNull(),
        scope: text("scope").default("global").notNull(),
        name: text("name").notNull(),
        isActive: boolean("is_active").default(false).notNull(),
        schemaVersion: integer("schema_version").default(1).notNull(),
        tokens: jsonRecord("tokens").default({}).notNull(),
        componentVariants: jsonRecord("component_variants")
            .default({})
            .notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("design_configs_scope_key_unique").on(table.scope, table.key),
        index("design_configs_scope_active_idx").on(table.scope, table.isActive),
        check(
            "design_configs_schema_version_check",
            sql`${table.schemaVersion} >= 1`,
        ),
    ],
);

export type NewDesignConfig = typeof designConfigs.$inferInsert;
export type DesignConfig = typeof designConfigs.$inferSelect;
