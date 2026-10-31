import { bookshelfCategoryHref, bookshelfHref, filterBookshelf, parseBookshelfType, safeSourceUrl } from "@/lib/bookshelf";
import { getBookshelfItemMetadata } from "@/lib/seo/metadata";
import { getSitemapEntries } from "@/lib/seo/discovery";
import type { BookshelfItem } from "@/shared/contracts/bookshelf";

const item: BookshelfItem = { id: 1, slug: "attention", type: "paper", title: "Attention Is All You Need", author: "Vaswani et al.", description: "Notes", tags: ["machine learning"], coverImageUrl: null, notes: null, externalUrl: null };

it("combines case-insensitive multiword search across fields with the selected media type", () => {
    const catalog = Array.from({ length: 200 }, (_, index) => ({ ...item, id: index + 1, slug: `paper-${index}` }));
    expect(filterBookshelf(catalog, "paper", "  ATTENTION vaswani learning  ")).toHaveLength(200);
    expect(filterBookshelf(catalog, "book", "attention")).toEqual([]);
    expect(filterBookshelf(catalog, null, "missing")).toEqual([]);
    expect(filterBookshelf(catalog, null, "notes")).toEqual([]);
    expect(filterBookshelf(catalog, null, "")).toHaveLength(200);
});

it("normalizes unknown types and safely encodes shareable URLs", () => {
    expect(parseBookshelfType("paper")).toBe("paper");
    expect(parseBookshelfType("javascript:alert(1)")).toBeNull();
    expect(bookshelfHref("book", " C# & React ", "a/b")).toBe("/bookshelf/a%2Fb?type=book&q=C%23+%26+React");
    expect(bookshelfHref(null, "", "paper")).toBe("/bookshelf/paper?type=all");
    expect(bookshelfHref(null)).toBe("/bookshelf");
});

it("only exposes HTTP(S) external source links", () => {
    for (const value of [null, "javascript:alert(1)", "data:text/html,hi", "/local", "invalid"]) expect(safeSourceUrl(value)).toBeNull();
    expect(safeSourceUrl("https://example.com/paper")).toBe("https://example.com/paper");
});

it("opens the first matching category item and leaves empty categories on the collection route", () => {
    expect(bookshelfCategoryHref([item, { ...item, id: 2, slug: "second" }], "paper")).toBe("/bookshelf/attention?type=paper");
    expect(bookshelfCategoryHref([item], "movie")).toBe("/bookshelf?type=movie");
    expect(bookshelfCategoryHref([item], "paper", "missing")).toBe("/bookshelf?type=paper&q=missing");
    expect(bookshelfCategoryHref([item], null)).toBe("/bookshelf");
});

it("uses canonical item URLs without query state and preserves legacy recommendation canonicals", () => {
    expect(getBookshelfItemMetadata(item).alternates?.canonical).toContain("/bookshelf/attention");
    expect(getBookshelfItemMetadata({ ...item, type: "book" }).alternates?.canonical).toContain("/recommendations/attention");
    const entries = getSitemapEntries([], [], [item, { ...item, type: "book" }]);
    expect(entries.filter(entry => entry.url.endsWith("/bookshelf/attention"))).toHaveLength(1);
    expect(entries.some(entry => entry.url.includes("?"))).toBe(false);
});
