import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { recommendations, recommendationTopics } from "@/lib/db/schema";
import type { RecommendationItem } from "./types";
import type { RecommendationTopicItem } from "./topic-types";

function toRecommendationItem(row: typeof recommendations.$inferSelect): RecommendationItem {
    return {
        id: row.id,
        slug: row.slug,
        type: row.type,
        category: row.category,
        title: row.title,
        author: row.author,
        description: row.description,
        coverImageUrl: row.coverImageUrl ?? null,
        externalUrl: row.externalUrl ?? null,
        notes: row.notes ?? null,
        isFeatured: row.isFeatured,
        isVisible: row.isVisible,
        sortOrder: row.sortOrder,
    };
}

function toRecommendationTopicItem(row: typeof recommendationTopics.$inferSelect): RecommendationTopicItem {
    return {
        id: row.id,
        recommendationId: row.recommendationId,
        slug: row.slug,
        title: row.title,
        sortOrder: row.sortOrder,
        content: row.content,
        isPublished: row.isPublished,
    };
}

export async function readRecommendations(): Promise<RecommendationItem[]> {
    try {
        const rows = await getDb()
            .select()
            .from(recommendations)
            .where(eq(recommendations.isVisible, true))
            .orderBy(asc(recommendations.sortOrder));

        return rows.map(toRecommendationItem);
    } catch (error) {
        console.error("Failed to read recommendations:", error);
        return [];
    }
}

export async function readFeaturedRecommendations(): Promise<RecommendationItem[]> {
    try {
        const rows = await getDb()
            .select()
            .from(recommendations)
            .where(
                and(
                    eq(recommendations.isVisible, true),
                    eq(recommendations.isFeatured, true),
                ),
            )
            .orderBy(asc(recommendations.sortOrder))
            .limit(3);

        return rows.map(toRecommendationItem);
    } catch (error) {
        console.error("Failed to read featured recommendations:", error);
        return [];
    }
}

export async function readRecommendationBySlug(
    slug: string,
): Promise<RecommendationItem | null> {
    try {
        const [row] = await getDb()
            .select()
            .from(recommendations)
            .where(
                and(
                    eq(recommendations.slug, slug),
                    eq(recommendations.isVisible, true),
                ),
            )
            .limit(1);

        if (!row) return null;
        return toRecommendationItem(row);
    } catch (error) {
        console.error("Failed to read recommendation by slug:", error);
        return null;
    }
}

export async function readTopicsByRecommendationId(
    recommendationId: number,
): Promise<RecommendationTopicItem[]> {
    try {
        const rows = await getDb()
            .select()
            .from(recommendationTopics)
            .where(
                and(
                    eq(recommendationTopics.recommendationId, recommendationId),
                    eq(recommendationTopics.isPublished, true),
                ),
            )
            .orderBy(asc(recommendationTopics.sortOrder));

        return rows.map(toRecommendationTopicItem);
    } catch (error) {
        console.error("Failed to read topics by recommendation ID:", error);
        return [];
    }
}

export async function readTopicBySlug(
    recommendationSlug: string,
    topicSlug: string,
): Promise<RecommendationTopicItem | null> {
    try {
        const [row] = await getDb()
            .select({
                topic: recommendationTopics,
            })
            .from(recommendationTopics)
            .innerJoin(
                recommendations,
                eq(recommendationTopics.recommendationId, recommendations.id),
            )
            .where(
                and(
                    eq(recommendations.slug, recommendationSlug),
                    eq(recommendations.isVisible, true),
                    eq(recommendationTopics.slug, topicSlug),
                    eq(recommendationTopics.isPublished, true),
                ),
            )
            .limit(1);

        if (!row) return null;
        return toRecommendationTopicItem(row.topic);
    } catch (error) {
        console.error("Failed to read topic by slug:", error);
        return null;
    }
}

export async function readAllTopicSlugs(): Promise<
    { recommendationSlug: string; topicSlug: string }[]
> {
    try {
        const rows = await getDb()
            .select({
                recommendationSlug: recommendations.slug,
                topicSlug: recommendationTopics.slug,
            })
            .from(recommendationTopics)
            .innerJoin(
                recommendations,
                eq(recommendationTopics.recommendationId, recommendations.id),
            )
            .where(
                and(
                    eq(recommendations.isVisible, true),
                    eq(recommendationTopics.isPublished, true),
                ),
            );

        return rows;
    } catch (error) {
        console.error("Failed to read all topic slugs:", error);
        return [];
    }
}

