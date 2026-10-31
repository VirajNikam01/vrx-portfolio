import "server-only";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import type { BookshelfType } from "@/shared/contracts/bookshelf";
import { getDb, type DatabaseTransaction } from "@/backend/db/client";
import { recommendations } from "@/backend/db/schema/recommendations";

type Filters = { isVisible: boolean; isFeatured?: boolean; limit?: number; types?: BookshelfType[] };

async function findMany(filters: Filters) {
    const query = getDb().select().from(recommendations).where(and(
        eq(recommendations.isVisible, filters.isVisible),
        filters.isFeatured === undefined ? undefined : eq(recommendations.isFeatured, filters.isFeatured),
        filters.types ? inArray(recommendations.type, filters.types) : undefined,
    )).orderBy(asc(recommendations.sortOrder), asc(recommendations.id));
    return filters.limit === undefined ? query : query.limit(filters.limit);
}

async function findBySlug(slug: string, isVisible: boolean): Promise<typeof recommendations.$inferSelect | null> {
    const [row] = await getDb().select().from(recommendations).where(and(
        eq(recommendations.slug, slug), eq(recommendations.isVisible, isVisible),
    )).limit(1);
    return row ?? null;
}

async function findBookshelfCatalog() {
    return getDb().select({
        id: recommendations.id, slug: recommendations.slug, type: recommendations.type,
        title: recommendations.title, author: recommendations.author, description: recommendations.description,
        coverImageUrl: recommendations.coverImageUrl, tags: recommendations.tags,
    }).from(recommendations).where(eq(recommendations.isVisible, true))
        .orderBy(asc(recommendations.sortOrder), asc(recommendations.id));
}

async function listAdmin() { return getDb().select().from(recommendations).orderBy(asc(recommendations.sortOrder), asc(recommendations.id)); }
async function findAdmin(id: number, tx?: DatabaseTransaction): Promise<typeof recommendations.$inferSelect | null> {
    const [row] = await (tx ?? getDb()).select().from(recommendations).where(eq(recommendations.id, id)).limit(1);
    return row ?? null;
}
async function createAdmin(values: typeof recommendations.$inferInsert) {
    const [row] = await getDb().insert(recommendations).values(values).returning();
    return row;
}
async function updateAdmin(id: number, version: number, values: Partial<typeof recommendations.$inferInsert>, tx: DatabaseTransaction): Promise<typeof recommendations.$inferSelect | null> {
    const [row] = await tx.update(recommendations).set({ ...values, version: sql`${recommendations.version} + 1`, updatedAt: new Date() })
        .where(and(eq(recommendations.id, id), eq(recommendations.version, version))).returning();
    return row ?? null;
}
async function withAdminLock<T>(id: number, operation: (row: typeof recommendations.$inferSelect | null, tx: DatabaseTransaction) => Promise<T>) {
    return getDb().transaction(async tx => {
        const [row] = await tx.select().from(recommendations).where(eq(recommendations.id, id)).for("update");
        return operation(row ?? null, tx);
    });
}
export const recommendationsRepository = { findMany, findBySlug, findBookshelfCatalog, listAdmin, findAdmin, createAdmin, updateAdmin, withAdminLock };
