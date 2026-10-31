import { landingPageContent } from "@/config/landing-page";
import { contentConfigsRepository } from "@/backend/repository/content_configs";
import { recommendationsRepository } from "@/backend/repository/recommendations";
import { recommendationTopicsRepository } from "@/backend/repository/recommendation_topics";
import { visitorsRepository } from "@/backend/repository/visitors";
import { contentConfigsService } from "@/backend/services/content-configs";
import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { visitorsService } from "@/backend/services/visitors";
import { resumeService } from "@/backend/services/resume";
import { blogService } from "@/backend/services/blog";
import { createResumeSignedUrl } from "@/backend/integrations/storage/resume";
import { fetchBlogFeed } from "@/backend/integrations/blog/rss";
import type { Recommendation } from "@/backend/db/schema/recommendations";
import type { RecommendationTopic } from "@/backend/db/schema/recommendation-topics";

jest.mock("@/backend/repository/content_configs", () => ({ contentConfigsRepository: { findByKey: jest.fn() } }));
jest.mock("@/backend/repository/recommendations", () => ({ recommendationsRepository: { findMany: jest.fn(), findBySlug: jest.fn() } }));
jest.mock("@/backend/repository/recommendation_topics", () => ({ recommendationTopicsRepository: {
    findByRecommendationId: jest.fn(), findBySlug: jest.fn(), findSlugsByRecommendationIds: jest.fn(),
} }));
jest.mock("@/backend/repository/visitors", () => ({ visitorsRepository: { upsert: jest.fn() } }));
jest.mock("@/backend/integrations/storage/resume", () => ({ createResumeSignedUrl: jest.fn() }));
jest.mock("@/backend/integrations/blog/rss", () => ({ fetchBlogFeed: jest.fn() }));

const recommendation: Recommendation = {
    id: 7, slug: "visible-book", type: "book", category: "tech", title: "Book", author: "Author",
    description: "Description", coverImageUrl: null, externalUrl: null, notes: null, tags: [],
    isFeatured: true, isVisible: true, sortOrder: 0, version: 0, slugLocked: true, createdAt: new Date(), updatedAt: new Date(),
};
const topic: RecommendationTopic = {
    id: 8, recommendationId: 7, slug: "chapter", title: "Chapter", content: "Notes",
    sortOrder: 0, isPublished: true, version: 0, slugLocked: true, createdAt: new Date(), updatedAt: new Date(),
};

beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe("content service", () => {
    it("rejects missing records and database failures instead of returning defaults", async () => {
        jest.mocked(contentConfigsRepository.findByKey).mockResolvedValueOnce(null).mockRejectedValueOnce(new Error("offline"));
        await expect(contentConfigsService.readLandingPageContent()).rejects.toThrow("not configured");
        await expect(contentConfigsService.readLandingPageContent()).rejects.toThrow("offline");
        expect(contentConfigsRepository.findByKey).toHaveBeenCalledWith("landing-page");
    });

    it("returns stored content without adding an active-record policy", async () => {
        const content = { ...landingPageContent, featureFlags: { ...landingPageContent.featureFlags, showBlog: false } };
        jest.mocked(contentConfigsRepository.findByKey).mockResolvedValue({
            id: 1, key: "landing-page", content, config: {}, isActive: false, version: 0, createdAt: new Date(), updatedAt: new Date(),
        });
        await expect(contentConfigsService.readLandingPageContent()).resolves.toEqual(content);
    });
});

describe("recommendation service", () => {
    it("requires visible records, limits featured records to three, and maps public DTOs", async () => {
        jest.mocked(recommendationsRepository.findMany).mockResolvedValue([recommendation]);
        const items = await recommendationsService.readFeaturedRecommendations();
        expect(recommendationsRepository.findMany).toHaveBeenCalledWith({ isVisible: true, isFeatured: true, limit: 3, types: ["book", "course"] });
        expect(items[0]).not.toHaveProperty("createdAt");
        expect(items[0].slug).toBe("visible-book");
        await recommendationsService.readRecommendations();
        expect(recommendationsRepository.findMany).toHaveBeenLastCalledWith({ isVisible: true, types: ["book", "course"] });
    });

    it("preserves empty-list and null-detail fallbacks on database failure", async () => {
        jest.mocked(recommendationsRepository.findMany).mockRejectedValue(new Error("offline"));
        jest.mocked(recommendationsRepository.findBySlug).mockRejectedValue(new Error("offline"));
        await expect(recommendationsService.readRecommendations()).resolves.toEqual([]);
        await expect(recommendationsService.readFeaturedRecommendations()).resolves.toEqual([]);
        await expect(recommendationsService.readRecommendationBySlug("missing")).resolves.toBeNull();
    });
});

describe("topic service composition", () => {
    it("resolves a visible parent through its owner service before reading a published topic", async () => {
        jest.mocked(recommendationsRepository.findBySlug).mockResolvedValue(recommendation);
        jest.mocked(recommendationTopicsRepository.findBySlug).mockResolvedValue(topic);
        const result = await recommendationTopicsService.readTopicBySlug("visible-book", "chapter");
        expect(recommendationsRepository.findBySlug).toHaveBeenCalledWith("visible-book", true);
        expect(recommendationTopicsRepository.findBySlug).toHaveBeenCalledWith(7, "chapter", true);
        expect(result).toMatchObject({ id: 8, recommendationId: 7 });
        expect(result).not.toHaveProperty("createdAt");
    });

    it("does not query topics when the parent is missing or invisible", async () => {
        jest.mocked(recommendationsRepository.findBySlug).mockResolvedValue(null);
        await expect(recommendationTopicsService.readTopicBySlug("hidden", "chapter")).resolves.toBeNull();
        expect(recommendationTopicsRepository.findBySlug).not.toHaveBeenCalled();
    });

    it("preserves missing-topic, list filtering, and database-error fallbacks", async () => {
        jest.mocked(recommendationsRepository.findBySlug).mockResolvedValue(recommendation);
        jest.mocked(recommendationTopicsRepository.findBySlug).mockResolvedValueOnce(null).mockRejectedValueOnce(new Error("offline"));
        await expect(recommendationTopicsService.readTopicBySlug("visible-book", "missing")).resolves.toBeNull();
        await expect(recommendationTopicsService.readTopicBySlug("visible-book", "missing")).resolves.toBeNull();
        jest.mocked(recommendationTopicsRepository.findByRecommendationId).mockResolvedValueOnce([topic]).mockRejectedValueOnce(new Error("offline"));
        const topics = await recommendationTopicsService.readTopicsByRecommendationId(7);
        expect(topics).toHaveLength(1);
        expect(recommendationTopicsRepository.findByRecommendationId).toHaveBeenCalledWith(7, true);
        await expect(recommendationTopicsService.readTopicsByRecommendationId(7)).resolves.toEqual([]);
    });

    it("batch-loads published sitemap topics for visible parents and excludes unrelated rows", async () => {
        jest.mocked(recommendationsRepository.findMany).mockResolvedValue([recommendation, { ...recommendation, id: 9, slug: "second" }]);
        jest.mocked(recommendationTopicsRepository.findSlugsByRecommendationIds).mockResolvedValue([
            { recommendationId: 7, topicSlug: "chapter" }, { recommendationId: 9, topicSlug: "intro" },
            { recommendationId: 100, topicSlug: "hidden" },
        ]);
        await expect(recommendationTopicsService.readAllTopicSlugs()).resolves.toEqual([
            { recommendationSlug: "visible-book", topicSlug: "chapter" }, { recommendationSlug: "second", topicSlug: "intro" },
        ]);
        expect(recommendationTopicsRepository.findSlugsByRecommendationIds).toHaveBeenCalledTimes(1);
        expect(recommendationTopicsRepository.findSlugsByRecommendationIds).toHaveBeenCalledWith([7, 9], true);
    });

    it("skips topic reads with no visible parents", async () => {
        jest.mocked(recommendationsRepository.findMany).mockResolvedValue([]);
        await expect(recommendationTopicsService.readAllTopicSlugs()).resolves.toEqual([]);
        expect(recommendationTopicsRepository.findSlugsByRecommendationIds).not.toHaveBeenCalled();
    });
});

it("visitor service supplies the identity and observation time to its repository", async () => {
    const before = Date.now();
    await visitorsService.ensureVisitor("visitor-123");
    expect(visitorsRepository.upsert).toHaveBeenCalledWith({ fingerprintHash: "visitor-123" }, expect.any(Date));
    expect(jest.mocked(visitorsRepository.upsert).mock.calls[0][1].getTime()).toBeGreaterThanOrEqual(before);
});

it("resume service preserves default and configured expiry", async () => {
    const original = process.env.RESUME_SIGNED_URL_EXPIRES_SECONDS;
    try {
        for (const [setting, expected] of [[undefined, 86400], ["invalid", 86400], ["-1", 86400], ["3600", 3600]] as const) {
            if (setting === undefined) delete process.env.RESUME_SIGNED_URL_EXPIRES_SECONDS;
            else process.env.RESUME_SIGNED_URL_EXPIRES_SECONDS = setting;
            await resumeService.createSignedUrl();
            expect(createResumeSignedUrl).toHaveBeenLastCalledWith(expected);
        }
    } finally {
        if (original === undefined) delete process.env.RESUME_SIGNED_URL_EXPIRES_SECONDS;
        else process.env.RESUME_SIGNED_URL_EXPIRES_SECONDS = original;
    }
});

it("blog service maps the feed and preserves the external-error fallback", async () => {
    jest.mocked(fetchBlogFeed).mockResolvedValueOnce({ items: [{ title: "Post", link: "https://example.com/post", contentSnippet: "Brief" }] });
    await expect(blogService.getBlogPosts()).resolves.toEqual([
        { title: "Post", slug: "post", url: "https://example.com/post", brief: "Brief", publishedAt: null },
    ]);
    jest.mocked(fetchBlogFeed).mockRejectedValueOnce(new Error("offline"));
    await expect(blogService.getBlogPosts()).resolves.toEqual([]);
});
