import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

let dbClient: ReturnType<typeof postgres> | undefined;
let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DATABASE_URL is required to store inquiries.");
    }

    dbClient ??= postgres(databaseUrl, {
        prepare: false,
    });
    db ??= drizzle(dbClient, { schema });

    return db;
}
