import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { recommendations } from "@/lib/db/schema";
import type { RecommendationItem } from "./types";

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
