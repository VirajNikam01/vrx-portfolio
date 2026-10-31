import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/backend/db/client";
import { contentConfigs } from "@/backend/db/schema/content-configs";

async function findByKey(key: string): Promise<typeof contentConfigs.$inferSelect | null> {
    const [record] = await getDb().select().from(contentConfigs).where(eq(contentConfigs.key, key)).limit(1);
    return record ?? null;
}

async function updateFeatureFlags(version: number, flags: Record<string, boolean>): Promise<typeof contentConfigs.$inferSelect | null> {
    const [record] = await getDb().update(contentConfigs).set({
        content: sql`jsonb_set(${contentConfigs.content}, '{featureFlags}', coalesce(${contentConfigs.content}->'featureFlags', '{}'::jsonb) || ${JSON.stringify(flags)}::jsonb, true)`,
        version: sql`${contentConfigs.version} + 1`, updatedAt: new Date(),
    }).where(and(eq(contentConfigs.key, "landing-page"), eq(contentConfigs.version, version), sql`jsonb_typeof(${contentConfigs.content}->'featureFlags') = 'object'`)).returning();
    return record ?? null;
}
export const contentConfigsRepository = { findByKey, updateFeatureFlags };
