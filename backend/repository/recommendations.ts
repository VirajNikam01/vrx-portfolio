import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/backend/db/client";
import { recommendations } from "@/backend/db/schema/recommendations";

type Filters = { isVisible: boolean; isFeatured?: boolean; limit?: number };

async function findMany(filters: Filters) {
    const query = getDb().select().from(recommendations).where(and(
        eq(recommendations.isVisible, filters.isVisible),
        filters.isFeatured === undefined ? undefined : eq(recommendations.isFeatured, filters.isFeatured),
    )).orderBy(asc(recommendations.sortOrder));
    return filters.limit === undefined ? query : query.limit(filters.limit);
}

async function findBySlug(slug: string, isVisible: boolean): Promise<typeof recommendations.$inferSelect | null> {
    const [row] = await getDb().select().from(recommendations).where(and(
        eq(recommendations.slug, slug), eq(recommendations.isVisible, isVisible),
    )).limit(1);
    return row ?? null;
}

export const recommendationsRepository = { findMany, findBySlug };
