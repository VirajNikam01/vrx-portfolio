import "server-only";
import { recommendationsRepository } from "@/backend/repository/recommendations";
import type { Recommendation } from "@/backend/db/schema/recommendations";
import type { RecommendationItem } from "@/shared/contracts/recommendations";

function toRecommendationItem(row: Recommendation): RecommendationItem {
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


async function readRecommendations(): Promise<RecommendationItem[]> {
    try {
        const rows = await recommendationsRepository.findMany({ isVisible: true });
        return rows.map(toRecommendationItem);
    } catch (error) {
        console.error("Failed to read recommendations:", error);
        return [];
    }
}

async function readFeaturedRecommendations(): Promise<RecommendationItem[]> {
    try {
        const rows = await recommendationsRepository.findMany({ isVisible: true, isFeatured: true, limit: 3 });
        return rows.map(toRecommendationItem);
    } catch (error) {
        console.error("Failed to read featured recommendations:", error);
        return [];
    }
}

async function readRecommendationBySlug(slug: string): Promise<RecommendationItem | null> {
    try {
        const row = await recommendationsRepository.findBySlug(slug, true);
        return row ? toRecommendationItem(row) : null;
    } catch (error) {
        console.error("Failed to read recommendation by slug:", error);
        return null;
    }
}

async function readRelatedRecommendations(slug: string, category: RecommendationItem["category"]) {
    const items = await readRecommendations();
    return items.filter(item => item.slug !== slug && item.category === category).slice(0, 3);
}

export const recommendationsService = {
    readRecommendations,
    readFeaturedRecommendations,
    readRecommendationBySlug,
    readRelatedRecommendations,
};
