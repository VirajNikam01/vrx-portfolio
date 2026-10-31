import { seoConfig, seoPages } from "@/config/seo";
import { createPageMetadata, homeMetadata, blogsMetadata, getRecommendationMetadata, getTopicMetadata } from "@/lib/seo/metadata";
import { getHomeJsonLd, getBlogPostsJsonLd, getRecommendationJsonLd, getTopicJsonLd } from "@/lib/seo/structured-data";
import { getSitemapEntries, getRobots, getLlmsText, getManifest } from "@/lib/seo/discovery";
import { serializeJsonLd } from "@/lib/seo/serialize-json-ld";
import { getSiteUrl, getRecommendationPath, getTopicPath } from "@/lib/seo/urls";
import type { RecommendationItem } from "@/shared/contracts/recommendations";
import type { RecommendationTopicItem } from "@/shared/contracts/recommendation-topics";

const item: RecommendationItem = {
    id: 7, slug: "book", type: "book", category: "tech", title: "Book", author: "Author", description: "Description",
    coverImageUrl: null, externalUrl: null, notes: null, isFeatured: true, isVisible: true, sortOrder: 0,
};
const topic: RecommendationTopicItem = { id: 8, recommendationId: 7, slug: "chapter", title: "Chapter", content: "Notes", sortOrder: 0, isPublished: true };

afterEach(() => jest.restoreAllMocks());

it("uses one normalized site origin for canonical URLs and entity IDs", () => {
    jest.replaceProperty(seoConfig, "siteUrl", "example.com");
    expect(getSiteUrl("/blogs")).toBe("https://example.com/blogs");
    expect(getBlogPostsJsonLd([])["@id"]).toBe("https://example.com/#featured-blog-posts");
    expect(getRecommendationPath("a/b")).toBe("/recommendations/a%2Fb");
    expect(getTopicPath("book", "chapter 1")).toBe("/recommendations/book/chapter%201");
});

it("keeps home titles absolute and gives each static page its own canonical and social URL", () => {
    expect(homeMetadata.title).toEqual({ absolute: seoConfig.title });
    expect(blogsMetadata.title).toBe("Blog");
    expect(blogsMetadata.alternates?.canonical).toBe(getSiteUrl("/blogs"));
    expect(blogsMetadata.openGraph).toMatchObject({ url: getSiteUrl("/blogs"), title: `Blog | ${seoConfig.name}` });
    expect(blogsMetadata.twitter).toMatchObject({ images: [getSiteUrl(seoConfig.socialImage)] });
    expect(createPageMetadata(seoPages.recommendations)).not.toHaveProperty("keywords");
});

it("shares metadata defaults between recommendation and topic pages and uses actual cover images when available", () => {
    const detail = getRecommendationMetadata(item);
    expect(detail.alternates?.canonical).toBe(getSiteUrl("/recommendations/book"));
    expect(detail.openGraph).toMatchObject({ type: "article", images: [getSiteUrl(seoConfig.socialImage)] });
    const chapter = getTopicMetadata({ ...item, coverImageUrl: "https://example.com/cover.jpg" }, topic);
    expect(chapter.title).toBe("Chapter — Book Notes");
    expect(chapter.alternates?.canonical).toBe(getSiteUrl("/recommendations/book/chapter"));
    expect(chapter.openGraph).toMatchObject({ images: ["https://example.com/cover.jpg"] });
});

it("serializes real Person and ProfilePage objects rather than unresolved promises", () => {
    const entries = getHomeJsonLd();
    expect(entries.map(entry => entry["@type"])).toEqual(["WebSite", "Person", "ProfilePage", "ItemList"]);
    const parsed = JSON.parse(serializeJsonLd(entries));
    expect(parsed[1]).toMatchObject({ "@type": "Person", name: seoConfig.name });
    expect(parsed[2]).toMatchObject({ "@type": "ProfilePage", mainEntity: { "@id": getSiteUrl("/#viraj-nikam") } });
});

it("preserves recommendation/topic structured data and escapes closing script tags", () => {
    const recommendation = getRecommendationJsonLd(item, [topic]);
    expect(recommendation).toMatchObject({ "@type": "Book", hasPart: [{ url: getSiteUrl("/recommendations/book/chapter") }] });
    expect(getTopicJsonLd(item, topic)).toMatchObject({ "@type": "TechArticle", mainEntityOfPage: { "@id": getSiteUrl("/recommendations/book/chapter") } });
    const maliciousTitle = { title: "</script><script>alert(1)</script>" };
    const serialized = serializeJsonLd(maliciousTitle);
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual(maliciousTitle);
});

it("indexes only actual static pages and the provided visible recommendation/published topic URLs", () => {
    const entries = getSitemapEntries([item, item], [{ recommendationSlug: "book", topicSlug: "chapter" }]);
    expect(entries.map(entry => entry.url)).toEqual([
        getSiteUrl("/"), getSiteUrl("/blogs"), getSiteUrl("/recommendations"), getSiteUrl("/bookshelf"),
        getSiteUrl("/recommendations/book"), getSiteUrl("/recommendations/book/chapter"),
    ]);
    for (const path of ["/installation", "/theme", "/work-experience"]) {
        expect(entries.some(entry => entry.url === getSiteUrl(path))).toBe(false);
    }
});

it("keeps robots, the manifest, and the AI discovery endpoint consistent with the site configuration", () => {
    expect(getRobots()).toMatchObject({ rules: [{ disallow: ["/api/", "/admin/"] }], sitemap: getSiteUrl("/sitemap.xml") });
    expect(getManifest()).toMatchObject({ name: seoConfig.title, lang: seoConfig.language, start_url: getSiteUrl("/") });
    const text = getLlmsText();
    expect(text).toContain(getSiteUrl("/blogs"));
    expect(text).toContain(getSiteUrl("/recommendations"));
    expect(text).not.toContain("/resume.pdf");
});
