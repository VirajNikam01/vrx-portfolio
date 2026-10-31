import { recommendationsRepository } from "@/backend/repository/recommendations";
import { recommendationsService } from "@/backend/services/recommendations";
import type { Recommendation } from "@/backend/db/schema/recommendations";

jest.mock("@/backend/repository/recommendations", () => ({ recommendationsRepository: {
    findBookshelfCatalog: jest.fn(), findBySlug: jest.fn(), findMany: jest.fn(),
} }));

const row: Recommendation = { id: 1, slug: "paper", type: "paper", category: "tech", title: "Paper", author: "Author", description: "Description", coverImageUrl: null, externalUrl: "javascript:alert(1)", notes: "Private full text", tags: [" AI ", "ai", ""], isFeatured: true, isVisible: true, sortOrder: 1, version: 0, slugLocked: false, createdAt: new Date(), updatedAt: new Date() };
beforeEach(() => jest.resetAllMocks());

it("returns compact catalog entries with normalized tags and no notes or storage fields", async () => {
    jest.mocked(recommendationsRepository.findBookshelfCatalog).mockResolvedValue([row]);
    const [result] = await recommendationsService.readBookshelfCatalog();
    expect(result.tags).toEqual(["ai"]);
    expect(result).not.toHaveProperty("notes");
    expect(result).not.toHaveProperty("externalUrl");
    expect(result).not.toHaveProperty("isVisible");
});

it("keeps new media out of legacy recommendation detail responses", async () => {
    jest.mocked(recommendationsRepository.findBySlug).mockResolvedValue(row);
    await expect(recommendationsService.readRecommendationBySlug("paper")).resolves.toBeNull();
    await expect(recommendationsService.readBookshelfItem("paper")).resolves.toMatchObject({ type: "paper", externalUrl: null, notes: "Private full text" });
});

it("excludes missing and hidden details", async () => {
    jest.mocked(recommendationsRepository.findBySlug).mockResolvedValueOnce(null).mockResolvedValueOnce({ ...row, isVisible: false });
    await expect(recommendationsService.readBookshelfItem("missing")).resolves.toBeNull();
    await expect(recommendationsService.readBookshelfItem("hidden")).resolves.toBeNull();
    expect(recommendationsRepository.findBySlug).toHaveBeenCalledWith("hidden", true);
});

it("propagates database errors instead of returning empty collections or false not-found results", async () => {
    jest.mocked(recommendationsRepository.findBookshelfCatalog).mockRejectedValue(new Error("offline"));
    jest.mocked(recommendationsRepository.findBySlug).mockRejectedValue(new Error("offline"));
    await expect(recommendationsService.readBookshelfCatalog()).rejects.toThrow("offline");
    await expect(recommendationsService.readBookshelfItem("paper")).rejects.toThrow("offline");
});
