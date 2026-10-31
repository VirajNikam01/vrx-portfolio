import "server-only";
import type { MetadataRoute } from "next";
import { seoConfig, seoPages } from "@/config/seo";
import { META_THEME_COLORS } from "@/config/site";
import { landingPageContent } from "@/config/landing-page";
import { getExperienceDurationLabel } from "@/lib/experience-duration";
import { getSiteUrl, getRecommendationPath, getTopicPath } from "./urls";
import type { RecommendationItem } from "@/shared/contracts/recommendations";
import type { BookshelfSummary } from "@/shared/contracts/bookshelf";

type TopicSlugPair = { recommendationSlug: string; topicSlug: string };

export function getSitemapEntries(items: RecommendationItem[], topics: TopicSlugPair[], shelf: BookshelfSummary[] = []): MetadataRoute.Sitemap {
    const paths = [
        ...Object.values(seoPages).map(page => page.path),
        ...items.map(item => getRecommendationPath(item.slug)),
        ...topics.map(topic => getTopicPath(topic.recommendationSlug, topic.topicSlug)),
        ...shelf.filter(item => item.type !== "book" && item.type !== "course").map(item => `/bookshelf/${encodeURIComponent(item.slug)}`),
    ];
    return [...new Set(paths)].map(path => ({ url: getSiteUrl(path) }));
}

export function getRobots(): MetadataRoute.Robots {
    return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] }], sitemap: getSiteUrl("/sitemap.xml") };
}

export function getManifest(): MetadataRoute.Manifest {
    return {
        name: seoConfig.title, short_name: seoConfig.shortTitle, description: seoConfig.description,
        start_url: getSiteUrl("/"), scope: getSiteUrl("/"), display: "standalone",
        background_color: META_THEME_COLORS.dark, theme_color: META_THEME_COLORS.dark,
        categories: ["portfolio", "developer", "software"], lang: seoConfig.language,
        icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
    };
}

export function getLlmsText() {
    const duration = getExperienceDurationLabel(
        landingPageContent.workExperiences,
    );
    const companies = landingPageContent.workExperiences
        .map((experience) => experience.companyName)
        .join(", ");
    const skills = Array.from(
        new Set(
            landingPageContent.workExperiences.flatMap((experience) =>
                experience.positions.flatMap((position) => position.skills ?? []),
            ),
        ),
    ).join(", ");


    return `# ${seoConfig.title}

> ${seoConfig.description}

## Primary URL
${getSiteUrl("/")}

## Person Entity
- Name: ${seoConfig.name}
- Also referenced as: Viraj, ${seoConfig.handle}
- Email: ${seoConfig.email}
- Experience: ${duration}
- Companies: ${companies}
- Skills: ${skills}

## Important Pages
- Home and portfolio: ${getSiteUrl(seoPages.home.path)}
- Blog: ${getSiteUrl(seoPages.blogs.path)}
- Recommendations: ${getSiteUrl(seoPages.recommendations.path)}
- Bookshelf: ${getSiteUrl(seoPages.bookshelf.path)}
- Work experience section: ${getSiteUrl("/#experience")}
- Contact: ${getSiteUrl("/#contact")}
- Sitemap: ${getSiteUrl("/sitemap.xml")}
- Robots: ${getSiteUrl("/robots.txt")}
`;
}
