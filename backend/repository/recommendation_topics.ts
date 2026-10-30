import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/backend/db/client";
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

export const recommendationTopicsRepository = { findByRecommendationId, findBySlug, findSlugsByRecommendationIds };
