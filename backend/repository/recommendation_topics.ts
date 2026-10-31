import "server-only";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { getDb, type DatabaseTransaction } from "@/backend/db/client";
import { recommendationTopics } from "@/backend/db/schema/recommendation-topics";

async function findByRecommendationId(recommendationId: number, isPublished: boolean) {
    return getDb().select().from(recommendationTopics).where(and(
        eq(recommendationTopics.recommendationId, recommendationId), eq(recommendationTopics.isPublished, isPublished),
    )).orderBy(asc(recommendationTopics.sortOrder));
}

async function findBySlug(recommendationId: number, slug: string, isPublished: boolean): Promise<typeof recommendationTopics.$inferSelect | null> {
    const [row] = await getDb().select().from(recommendationTopics).where(and(
        eq(recommendationTopics.recommendationId, recommendationId),
        eq(recommendationTopics.slug, slug), eq(recommendationTopics.isPublished, isPublished),
    )).limit(1);
    return row ?? null;
}

async function findSlugsByRecommendationIds(ids: number[], isPublished: boolean) {
    if (!ids.length) return [];
    return getDb().select({ recommendationId: recommendationTopics.recommendationId, topicSlug: recommendationTopics.slug })
        .from(recommendationTopics).where(and(
            inArray(recommendationTopics.recommendationId, ids), eq(recommendationTopics.isPublished, isPublished),
        ));
}

async function listAdmin(parentId: number, tx?: DatabaseTransaction) {
    return (tx ?? getDb()).select().from(recommendationTopics).where(eq(recommendationTopics.recommendationId, parentId)).orderBy(asc(recommendationTopics.sortOrder), asc(recommendationTopics.id));
}
async function findAdmin(parentId: number, id: number, tx?: DatabaseTransaction): Promise<typeof recommendationTopics.$inferSelect | null> {
    const [row] = await (tx ?? getDb()).select().from(recommendationTopics).where(and(eq(recommendationTopics.id, id), eq(recommendationTopics.recommendationId, parentId))).limit(1);
    return row ?? null;
}
async function createAdmin(values: typeof recommendationTopics.$inferInsert, tx: DatabaseTransaction) {
    const [row] = await tx.insert(recommendationTopics).values(values).returning();
    return row;
}
async function updateAdmin(parentId: number, id: number, version: number, values: Partial<typeof recommendationTopics.$inferInsert>, tx: DatabaseTransaction): Promise<typeof recommendationTopics.$inferSelect | null> {
    const [row] = await tx.update(recommendationTopics).set({ ...values, version: sql`${recommendationTopics.version} + 1`, updatedAt: new Date() })
        .where(and(eq(recommendationTopics.id, id), eq(recommendationTopics.recommendationId, parentId), eq(recommendationTopics.version, version))).returning();
    return row ?? null;
}
export const recommendationTopicsRepository = { findByRecommendationId, findBySlug, findSlugsByRecommendationIds, listAdmin, findAdmin, createAdmin, updateAdmin };
