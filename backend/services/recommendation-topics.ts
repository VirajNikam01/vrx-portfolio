import "server-only";
import { recommendationTopicsRepository } from "@/backend/repository/recommendation_topics";
import { recommendationsService } from "./recommendations";
import type { RecommendationTopic } from "@/backend/db/schema/recommendation-topics";
import type { RecommendationTopicItem } from "@/shared/contracts/recommendation-topics";

function toRecommendationTopicItem(row: RecommendationTopic): RecommendationTopicItem {
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


async function readTopicsByRecommendationId(recommendationId: number): Promise<RecommendationTopicItem[]> {
    try {
        const rows = await recommendationTopicsRepository.findByRecommendationId(recommendationId, true);
        return rows.map(toRecommendationTopicItem);
    } catch (error) {
        console.error("Failed to read topics by recommendation ID:", error);
        return [];
    }
}

async function readTopicBySlug(recommendationSlug: string, topicSlug: string): Promise<RecommendationTopicItem | null> {
    try {
        const parent = await recommendationsService.readRecommendationBySlug(recommendationSlug);
        if (!parent) return null;
        const row = await recommendationTopicsRepository.findBySlug(parent.id, topicSlug, true);
        return row ? toRecommendationTopicItem(row) : null;
    } catch (error) {
        console.error("Failed to read topic by slug:", error);
        return null;
    }
}

async function readAllTopicSlugs(): Promise<{ recommendationSlug: string; topicSlug: string }[]> {
    try {
        const parents = await recommendationsService.readRecommendations();
        if (!parents.length) return [];
        const slugs = new Map(parents.map(parent => [parent.id, parent.slug]));
        const topics = await recommendationTopicsRepository.findSlugsByRecommendationIds(parents.map(parent => parent.id), true);
        return topics.flatMap(topic => {
            const recommendationSlug = slugs.get(topic.recommendationId);
            return recommendationSlug === undefined ? [] : [{ recommendationSlug, topicSlug: topic.topicSlug }];
        });
    } catch (error) {
        console.error("Failed to read all topic slugs:", error);
        return [];
    }
}

export const recommendationTopicsService = {
    readTopicsByRecommendationId,
    readTopicBySlug,
    readAllTopicSlugs,
};
