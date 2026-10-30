import { seoConfig } from "@/config/seo";

export function getSiteUrl(path = "/") {
    const baseUrl = /^https?:\/\//i.test(seoConfig.siteUrl)
        ? seoConfig.siteUrl
        : `https://${seoConfig.siteUrl}`;
    return new URL(path, baseUrl).toString();
}

export function getRecommendationPath(slug: string) {
    return `/recommendations/${encodeURIComponent(slug)}`;
}

export function getTopicPath(recommendationSlug: string, topicSlug: string) {
    return `${getRecommendationPath(recommendationSlug)}/${encodeURIComponent(topicSlug)}`;
}
