import type { MetadataRoute } from "next";
import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { getSitemapEntries } from "@/lib/seo/discovery";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const items = await recommendationsService.readRecommendations();
    const topics = await recommendationTopicsService.readAllTopicSlugs();
    return getSitemapEntries(items, topics);
}
