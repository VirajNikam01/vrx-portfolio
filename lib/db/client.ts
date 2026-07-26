import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

let dbClient: ReturnType<typeof postgres> | undefined;
let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

function getDatabaseUrl() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }

    try {
        const { env } = getCloudflareContext();
        return (env as { DATABASE_URL?: string }).DATABASE_URL;
    } catch {
        return undefined;
    }
}

export function getDb() {
    const databaseUrl = getDatabaseUrl();

    if (!databaseUrl) {
        throw new Error("DATABASE_URL is required to connect to the database.");
    }

    dbClient ??= postgres(databaseUrl, {
        prepare: false,
    });
    database ??= drizzle(dbClient, { schema });

    return database;
}
