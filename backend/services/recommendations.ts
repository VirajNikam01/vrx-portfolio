import "server-only";
import { recommendationsRepository } from "@/backend/repository/recommendations";
import type { Recommendation } from "@/backend/db/schema/recommendations";
import type { RecommendationItem } from "@/shared/contracts/recommendations";
import type { BookshelfItem, BookshelfSummary } from "@/shared/contracts/bookshelf";
import { safeSourceUrl } from "@/lib/bookshelf";
import { adminItemSchema, type AdminItem, type AdminItemInput } from "@/shared/contracts/bookshelf-admin";
import type { DatabaseTransaction } from "@/backend/db/client";
import { AdminError } from "@/backend/errors/admin";

function toRecommendationItem(row: Recommendation): RecommendationItem {
    if (row.type !== "book" && row.type !== "course") {
        throw new Error("Unsupported recommendation type");
    }
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
        const rows = await recommendationsRepository.findMany({ isVisible: true, types: ["book", "course"] });
        return rows.map(toRecommendationItem);
    } catch (error) {
        console.error("Failed to read recommendations:", error);
        return [];
    }
}

async function readFeaturedRecommendations(): Promise<RecommendationItem[]> {
    try {
        const rows = await recommendationsRepository.findMany({ isVisible: true, isFeatured: true, limit: 3, types: ["book", "course"] });
        return rows.map(toRecommendationItem);
    } catch (error) {
        console.error("Failed to read featured recommendations:", error);
        return [];
    }
}

async function readRecommendationBySlug(slug: string): Promise<RecommendationItem | null> {
    try {
        const row = await recommendationsRepository.findBySlug(slug, true);
        return row && (row.type === "book" || row.type === "course") ? toRecommendationItem(row) : null;
    } catch (error) {
        console.error("Failed to read recommendation by slug:", error);
        return null;
    }
}

async function readRelatedRecommendations(slug: string, category: RecommendationItem["category"]) {
    const items = await readRecommendations();
    return items.filter(item => item.slug !== slug && item.category === category).slice(0, 3);
}

function toBookshelfSummary(row: BookshelfSummary): BookshelfSummary {
    return {
        id: row.id, slug: row.slug, type: row.type, title: row.title, author: row.author,
        description: row.description, coverImageUrl: safeSourceUrl(row.coverImageUrl) ?? (row.coverImageUrl?.startsWith("/") && !row.coverImageUrl.startsWith("//") ? row.coverImageUrl : null),
        tags: [...new Set(row.tags.map(tag => tag.trim().toLowerCase()).filter(Boolean))],
    };
}

async function readBookshelfCatalog(): Promise<BookshelfSummary[]> {
    const rows = await recommendationsRepository.findBookshelfCatalog();
    return rows.map(toBookshelfSummary);
}

async function readBookshelfItem(slug: string): Promise<BookshelfItem | null> {
    const row = await recommendationsRepository.findBySlug(slug, true);
    if (!row || !row.isVisible) return null;
    return { ...toBookshelfSummary(row), notes: row.notes, externalUrl: safeSourceUrl(row.externalUrl) };
}

function toAdminItem(row: Recommendation): AdminItem {
    return { id: row.id, type: row.type, title: row.title, author: row.author, slug: row.slug, description: row.description,
        category: row.category, coverImageUrl: row.coverImageUrl ?? "", externalUrl: row.externalUrl ?? "", notes: row.notes ?? "",
        tags: row.tags, sortOrder: row.sortOrder, isFeatured: row.isFeatured, isVisible: row.isVisible,
        version: row.version, slugLocked: row.slugLocked || row.isVisible, updatedAt: row.updatedAt.toISOString() };
}
function adminValues(input: AdminItemInput) {
    const { version: _version, ...values } = adminItemSchema.parse(input);
    return { ...values, coverImageUrl: values.coverImageUrl || null, externalUrl: values.externalUrl || null, notes: values.notes || null,
        isFeatured: ["book", "course"].includes(values.type) && values.isFeatured };
}
async function readAdminItems() { return (await recommendationsRepository.listAdmin()).map(toAdminItem); }
async function readAdminItem(id: number, tx?: DatabaseTransaction) {
    const row = await recommendationsRepository.findAdmin(id, tx);
    return row ? toAdminItem(row) : null;
}
async function createAdminItem(input: AdminItemInput) {
    const values = adminValues(input);
    return toAdminItem(await recommendationsRepository.createAdmin({ ...values, slugLocked: values.isVisible }));
}
async function updateAdminItem(current: AdminItem, input: AdminItemInput, tx: DatabaseTransaction) {
    if (input.version === undefined) throw new AdminError(422, "A record version is required");
    if (current.slugLocked && current.slug !== input.slug) throw new AdminError(422, "Published URLs cannot be changed", { slug: ["This URL is already published"] });
    const row = await recommendationsRepository.updateAdmin(current.id, input.version, { ...adminValues(input), slugLocked: current.slugLocked || input.isVisible }, tx);
    if (!row) throw new AdminError(409, "This item changed in another tab. Reload the latest version before saving.");
    return toAdminItem(row);
}
async function withAdminItem<T>(id: number, operation: (item: AdminItem, tx: DatabaseTransaction) => Promise<T>) {
    return recommendationsRepository.withAdminLock(id, async (row, tx) => {
        if (!row) throw new AdminError(404, "Item not found");
        return operation(toAdminItem(row), tx);
    });
}

export const recommendationsService = {
    readAdminItems, readAdminItem, createAdminItem, updateAdminItem, withAdminItem,
    readBookshelfCatalog,
    readBookshelfItem,
    readRecommendations,
    readFeaturedRecommendations,
    readRecommendationBySlug,
    readRelatedRecommendations,
};
