import { bookshelfTypes, type BookshelfSummary, type BookshelfType } from "@/shared/contracts/bookshelf";

export function parseBookshelfType(value: string | null): BookshelfType | null {
    return bookshelfTypes.find(type => type === value) ?? null;
}

export function filterBookshelf(items: BookshelfSummary[], type: BookshelfType | null, query: string) {
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return items.filter(item => {
        if (type && item.type !== type) return false;
        const text = [item.title, item.author, ...item.tags].join(" ").toLocaleLowerCase();
        return words.every(word => text.includes(word));
    });
}

export function bookshelfHref(type: BookshelfType | null, query = "", slug?: string) {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    // An explicit All context distinguishes grid selections from fresh item links.
    else if (slug) params.set("type", "all");
    if (query.trim()) params.set("q", query.trim());
    const path = slug ? `/bookshelf/${encodeURIComponent(slug)}` : "/bookshelf";
    return `${path}${params.size ? `?${params}` : ""}`;
}

export function bookshelfCategoryHref(items: BookshelfSummary[], type: BookshelfType | null, query = "") {
    const first = type ? filterBookshelf(items, type, query)[0] : null;
    return bookshelfHref(type, query, first?.slug);
}

export function safeSourceUrl(value: string | null) {
    if (!value) return null;
    try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol) ? url.href : null;
    } catch {
        return null;
    }
}
