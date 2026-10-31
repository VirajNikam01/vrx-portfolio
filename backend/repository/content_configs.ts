import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/backend/db/client";
import { contentConfigs } from "@/backend/db/schema/content-configs";

async function findByKey(key: string): Promise<typeof contentConfigs.$inferSelect | null> {
    const [record] = await getDb().select().from(contentConfigs).where(eq(contentConfigs.key, key)).limit(1);
    return record ?? null;
}

export const contentConfigsRepository = { findByKey };
