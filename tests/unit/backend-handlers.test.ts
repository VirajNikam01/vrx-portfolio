/** @jest-environment node */
import { NextRequest } from "next/server";
import { GET as listRecommendations } from "@/app/api/recommendations/route";
import { GET as getRecommendation } from "@/app/api/recommendations/[slug]/route";
import { GET as getTopics } from "@/app/api/recommendations/[slug]/topics/route";
import { GET as getTopic } from "@/app/api/recommendations/[slug]/topics/[topicSlug]/route";
import { GET as getLandingPage } from "@/app/api/content/landing-page/route";
import { GET as getBlog } from "@/app/api/blog/route";
import { POST as recordVisit } from "@/app/api/visitors/route";
import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { contentConfigsService } from "@/backend/services/content-configs";
import { blogService } from "@/backend/services/blog";
import { visitorsService } from "@/backend/services/visitors";
import sitemap from "@/app/sitemap";
import type { RecommendationItem } from "@/shared/contracts/recommendations";

jest.mock("@/backend/services/recommendations", () => ({ recommendationsService: {
    readRecommendations: jest.fn(), readFeaturedRecommendations: jest.fn(), readRecommendationBySlug: jest.fn(),
} }));
jest.mock("@/backend/services/recommendation-topics", () => ({ recommendationTopicsService: {
    readAllTopicSlugs: jest.fn(), readTopicsByRecommendationId: jest.fn(), readTopicBySlug: jest.fn(),
} }));
jest.mock("@/backend/services/content-configs", () => ({ contentConfigsService: { readLandingPageContent: jest.fn() } }));
jest.mock("@/backend/services/blog", () => ({ blogService: { getBlogPosts: jest.fn() } }));
jest.mock("@/backend/services/visitors", () => ({ visitorsService: { recordVisit: jest.fn() } }));

const item: RecommendationItem = {
    id: 7, slug: "book", type: "book", category: "tech", title: "Book", author: "Author", description: "Description",
    coverImageUrl: null, externalUrl: null, notes: null, isFeatured: true, isVisible: true, sortOrder: 0,
};
const request = (url: string) => new NextRequest(`http://localhost${url}`);
beforeEach(() => jest.resetAllMocks());

it("preserves recommendation list and featured query responses", async () => {
    jest.mocked(recommendationsService.readRecommendations).mockResolvedValue([item]);
    jest.mocked(recommendationsService.readFeaturedRecommendations).mockResolvedValue([]);
    const recommendationsResponse = await listRecommendations(request("/api/recommendations"));
    const recommendationsResponseBody = await recommendationsResponse.json();
    expect(recommendationsResponseBody).toEqual({ data: [item] });
    const featuredRecommendationsResponse = await listRecommendations(request("/api/recommendations?featured=true"));
    const featuredRecommendationsResponseBody = await featuredRecommendationsResponse.json();
    expect(featuredRecommendationsResponseBody).toEqual({ data: [] });
    expect(recommendationsService.readFeaturedRecommendations).toHaveBeenCalledTimes(1);
});

it("preserves distinct detail, missing-parent, and missing-topic errors", async () => {
    jest.mocked(recommendationsService.readRecommendationBySlug).mockResolvedValue(null);
    jest.mocked(recommendationTopicsService.readTopicBySlug).mockResolvedValue(null);
    const context = { params: Promise.resolve({ slug: "missing" }) };
    const detail = await getRecommendation(request("/"), context);
    expect(detail.status).toBe(404);
    const detailBody = await detail.json();
    expect(detailBody).toEqual({ error: "Not found" });
    const topics = await getTopics(request("/"), context);
    expect(topics.status).toBe(404);
    const topicsBody = await topics.json();
    expect(topicsBody).toEqual({ error: "Recommendation not found" });
    expect(recommendationTopicsService.readTopicsByRecommendationId).not.toHaveBeenCalled();
    const topic = await getTopic(request("/"), { params: Promise.resolve({ slug: "book", topicSlug: "missing" }) });
    expect(topic.status).toBe(404);
    const topicBody = await topic.json();
    expect(topicBody).toEqual({ error: "Topic not found" });
});

it("preserves successful recommendation and topic response nesting", async () => {
    jest.mocked(recommendationsService.readRecommendationBySlug).mockResolvedValue(item);
    jest.mocked(recommendationTopicsService.readTopicsByRecommendationId).mockResolvedValue([]);
    const topic = { id: 1, recommendationId: 7, slug: "intro", title: "Intro", sortOrder: 0, content: "Notes", isPublished: true };
    jest.mocked(recommendationTopicsService.readTopicBySlug).mockResolvedValue(topic);
    const recommendationResponse = await getRecommendation(request("/"), { params: Promise.resolve({ slug: "book" }) });
    const recommendationResponseBody = await recommendationResponse.json();
    expect(recommendationResponseBody).toEqual({ data: item });
    const topicsResponse = await getTopics(request("/"), { params: Promise.resolve({ slug: "book" }) });
    const topicsResponseBody = await topicsResponse.json();
    expect(topicsResponseBody).toEqual({ data: [] });
    const topicResponse = await getTopic(request("/"), { params: Promise.resolve({ slug: "book", topicSlug: "intro" }) });
    const topicResponseBody = await topicResponse.json();
    expect(topicResponseBody).toEqual({ data: topic });
    expect(recommendationTopicsService.readTopicsByRecommendationId).toHaveBeenCalledWith(7);
});

it("wraps content and blog service results without changing response shape", async () => {
    jest.mocked(contentConfigsService.readLandingPageContent).mockResolvedValue({} as Awaited<ReturnType<typeof contentConfigsService.readLandingPageContent>>);
    jest.mocked(blogService.getBlogPosts).mockResolvedValue([]);
    const landingPageResponse = await getLandingPage();
    const landingPageResponseBody = await landingPageResponse.json();
    expect(landingPageResponseBody).toEqual({ data: {} });
    const blogResponse = await getBlog();
    const blogResponseBody = await blogResponse.json();
    expect(blogResponseBody).toEqual({ data: [] });
});

it("returns a non-cacheable error without defaults when landing content fails", async () => {
    const errorLog = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
        jest.mocked(contentConfigsService.readLandingPageContent).mockRejectedValue(new Error("database credentials"));
        const response = await getLandingPage();
        expect(response.status).toBe(503);
        expect(response.headers.get("Cache-Control")).toBe("no-store");
        expect(await response.json()).toEqual({ error: "Landing page content is temporarily unavailable" });
    } finally {
        errorLog.mockRestore();
    }
});

it("preserves visitor validation and extracts request headers before calling its service", async () => {
    const invalid = await recordVisit(new NextRequest("http://localhost/api/visitors", { method: "POST", body: "{}" }));
    expect(invalid.status).toBe(422);
    const invalidBody = await invalid.json();
    expect(invalidBody).toMatchObject({ success: false });
    expect(visitorsService.recordVisit).not.toHaveBeenCalled();
    const payload = { visitorId: "visitor", devicePixelRatio: 1, screen: "1280x720", platform: "Win32", timezone: "Asia/Calcutta",
        language: "en", cookiesEnabled: true, hardwareConcurrency: 8, maxTouchPoints: 0, colorDepth: 24 };
    const response = await recordVisit(new NextRequest("http://localhost/api/visitors", {
        method: "POST", body: JSON.stringify(payload), headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8", "user-agent": "Test", "x-vercel-ip-country": "IN" },
    }));
    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ success: true });
    expect(visitorsService.recordVisit).toHaveBeenCalledWith(payload, { ip: "1.2.3.4", userAgent: "Test", country: "IN", region: null, city: null });
});

it("builds recommendation and topic sitemap URLs through services", async () => {
    jest.mocked(recommendationsService.readRecommendations).mockResolvedValue([item]);
    jest.mocked(recommendationTopicsService.readAllTopicSlugs).mockResolvedValue([{ recommendationSlug: "book", topicSlug: "intro" }]);
    const entries = await sitemap();
    expect(entries.some(entry => entry.url.endsWith("/recommendations/book"))).toBe(true);
    expect(entries.some(entry => entry.url.endsWith("/recommendations/book/intro"))).toBe(true);
    expect(entries.some(entry => entry.url.endsWith("/blogs"))).toBe(true);
});
