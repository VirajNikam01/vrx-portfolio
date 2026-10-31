import { adminItemSchema, adminTopicSchema, suggestSlug } from "@/shared/contracts/bookshelf-admin";
import { safeAdminReturn } from "@/shared/contracts/admin";
import { recommendationsRepository } from "@/backend/repository/recommendations";
import { recommendationTopicsRepository } from "@/backend/repository/recommendation_topics";
import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { bookshelfAdminService } from "@/backend/services/bookshelf-admin";
import type { Recommendation } from "@/backend/db/schema/recommendations";
import type { DatabaseTransaction } from "@/backend/db/client";

jest.mock("@/backend/repository/recommendations", () => ({ recommendationsRepository: { createAdmin: jest.fn(), updateAdmin: jest.fn(), withAdminLock: jest.fn() } }));
jest.mock("@/backend/repository/recommendation_topics", () => ({ recommendationTopicsRepository: { listAdmin: jest.fn(), findAdmin: jest.fn(), updateAdmin: jest.fn(), createAdmin: jest.fn() } }));
const input = { type: "book" as const, title: "A book", author: "Author", slug: "a-book", description: "Description", category: "tech" as const, coverImageUrl: "", externalUrl: "", notes: "Notes", tags: [" AI ", "ai"], sortOrder: 0, isFeatured: false, isVisible: false, version: 0 };
const row: Recommendation = { ...input, id: 1, coverImageUrl: null, externalUrl: null, slugLocked: true, createdAt: new Date(), updatedAt: new Date() };
const tx = {} as DatabaseTransaction;
beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(recommendationsRepository.withAdminLock).mockImplementation(async (_id, operation) => operation(row, tx));
});

it("validates fields and normalizes tags without accepting private IDs or unsafe links", () => {
    expect(adminItemSchema.parse(input).tags).toEqual(["ai"]);
    expect(adminItemSchema.safeParse({ ...input, id: 99 }).success).toBe(false);
    for (const value of ["javascript:alert(1)", "//example.com/a", "/images/../secret", "/images/%2e%2e/secret", "https://user:secret@example.com/a"]) expect(adminItemSchema.safeParse({ ...input, coverImageUrl: value }).success).toBe(false);
    expect(adminTopicSchema.safeParse({ title: "Topic", slug: "topic", content: "", sortOrder: 0, isPublished: true }).success).toBe(false);
    expect(suggestSlug("A New Book!")).toBe("a-new-book");
    expect(safeAdminReturn("//example.com")).toBe("/admin");
    expect(safeAdminReturn("/admin/bookshelf/1/edit")).toBe("/admin/bookshelf/1/edit");
});

it("writes explicit draft visibility and clears unsupported featured state", async () => {
    jest.mocked(recommendationsRepository.createAdmin).mockResolvedValue({ ...row, type: "movie", slugLocked: false });
    await recommendationsService.createAdminItem({ ...input, type: "movie", isFeatured: true });
    expect(recommendationsRepository.createAdmin).toHaveBeenCalledWith(expect.objectContaining({ type: "movie", isVisible: false, isFeatured: false, slugLocked: false, tags: ["ai"] }));
});

it("requires a body when publishing an original note while allowing unfinished drafts", () => {
    expect(adminItemSchema.safeParse({ ...input, type: "note", notes: "", isVisible: false }).success).toBe(true);
    expect(adminItemSchema.safeParse({ ...input, type: "note", notes: "  ", isVisible: true }).success).toBe(false);
    expect(adminItemSchema.safeParse({ ...input, type: "note", notes: "An original thought.", isVisible: true }).success).toBe(true);
});

it("locks published URLs even after hiding and rejects stale edits", async () => {
    await expect(bookshelfAdminService.updateItem(1, { ...input, slug: "changed" })).rejects.toMatchObject({ status: 422 });
    jest.mocked(recommendationsRepository.updateAdmin).mockResolvedValue(null);
    await expect(bookshelfAdminService.updateItem(1, input)).rejects.toMatchObject({ status: 409 });
    expect(recommendationsRepository.updateAdmin).toHaveBeenCalledWith(1, 0, expect.any(Object), tx);
});

it("checks topic dependencies inside the parent lock before changing media type", async () => {
    jest.mocked(recommendationTopicsRepository.listAdmin).mockResolvedValue([{ id: 2, recommendationId: 1, title: "Topic", slug: "topic", content: "Notes", sortOrder: 0, isPublished: false, version: 0, slugLocked: false, createdAt: new Date(), updatedAt: new Date() }]);
    await expect(bookshelfAdminService.updateItem(1, { ...input, type: "paper" })).rejects.toMatchObject({ status: 422 });
    expect(recommendationTopicsRepository.listAdmin).toHaveBeenCalledWith(1, tx);
    expect(recommendationsRepository.updateAdmin).not.toHaveBeenCalled();
});

it("publishes atomically with a locked URL and preserves that lock when hidden again", async () => {
    jest.mocked(recommendationsRepository.updateAdmin).mockResolvedValueOnce({ ...row, isVisible: true, slugLocked: true, version: 1 }).mockResolvedValueOnce({ ...row, isVisible: false, slugLocked: true, version: 2 });
    await expect(bookshelfAdminService.updateItem(1, { ...input, isVisible: true })).resolves.toMatchObject({ isVisible: true, slugLocked: true, version: 1 });
    expect(recommendationsRepository.updateAdmin).toHaveBeenLastCalledWith(1, 0, expect.objectContaining({ isVisible: true, slugLocked: true }), tx);
    await expect(bookshelfAdminService.updateItem(1, { ...input, isVisible: false, version: 1 })).resolves.toMatchObject({ isVisible: false, slugLocked: true, version: 2 });
});

it("prevents cross-parent topic editing and publishing an empty topic", async () => {
    jest.mocked(recommendationTopicsRepository.findAdmin).mockResolvedValue(null);
    await expect(recommendationTopicsService.updateAdminTopic(1, 9, { title: "Topic", slug: "topic", content: "Notes", sortOrder: 0, isPublished: false, version: 0 }, tx)).rejects.toMatchObject({ status: 404 });
    expect(recommendationTopicsRepository.updateAdmin).not.toHaveBeenCalled();
});
