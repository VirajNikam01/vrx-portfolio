import "server-only";
import { recommendationTopicsRepository } from "@/backend/repository/recommendation_topics";
import { recommendationsService } from "./recommendations";
import type { RecommendationTopic } from "@/backend/db/schema/recommendation-topics";
import type { RecommendationTopicItem } from "@/shared/contracts/recommendation-topics";
import { adminTopicSchema, type AdminTopic, type AdminTopicInput } from "@/shared/contracts/bookshelf-admin";
import type { DatabaseTransaction } from "@/backend/db/client";
import { AdminError } from "@/backend/errors/admin";

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

function toAdminTopic(row: RecommendationTopic): AdminTopic {
    return { id: row.id, recommendationId: row.recommendationId, title: row.title, slug: row.slug, content: row.content, sortOrder: row.sortOrder,
        isPublished: row.isPublished, version: row.version, slugLocked: row.slugLocked || row.isPublished, updatedAt: row.updatedAt.toISOString() };
}
async function readAdminTopics(parentId: number, tx?: DatabaseTransaction) { return (await recommendationTopicsRepository.listAdmin(parentId, tx)).map(toAdminTopic); }
async function readAdminTopic(parentId: number, id: number, tx?: DatabaseTransaction) {
    const row = await recommendationTopicsRepository.findAdmin(parentId, id, tx);
    return row ? toAdminTopic(row) : null;
}
async function createAdminTopic(parentId: number, input: AdminTopicInput, tx: DatabaseTransaction) {
    const { version: _version, ...values } = adminTopicSchema.parse(input);
    return toAdminTopic(await recommendationTopicsRepository.createAdmin({ ...values, recommendationId: parentId, slugLocked: values.isPublished }, tx));
}
async function updateAdminTopic(parentId: number, id: number, input: AdminTopicInput, tx: DatabaseTransaction) {
    const current = await readAdminTopic(parentId, id, tx);
    if (!current) throw new AdminError(404, "Topic not found");
    if (input.version === undefined) throw new AdminError(422, "A record version is required");
    if (current.slugLocked && current.slug !== input.slug) throw new AdminError(422, "Published topic URLs cannot be changed", { slug: ["This URL is already published"] });
    const { version, ...values } = adminTopicSchema.parse(input);
    const row = await recommendationTopicsRepository.updateAdmin(parentId, id, version!, { ...values, slugLocked: current.slugLocked || values.isPublished }, tx);
    if (!row) throw new AdminError(409, "This topic changed in another tab. Reload the latest version before saving.");
    return toAdminTopic(row);
}
export const recommendationTopicsService = {
    readAdminTopics, readAdminTopic, createAdminTopic, updateAdminTopic,
    readTopicsByRecommendationId,
    readTopicBySlug,
    readAllTopicSlugs,
};
