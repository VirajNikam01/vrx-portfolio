import type { MetadataRoute } from "next";
import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { getSitemapEntries } from "@/lib/seo/discovery";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const items = await recommendationsService.readRecommendations();
    const topics = await recommendationTopicsService.readAllTopicSlugs();
    // Keep existing discovery available if the bookshelf query is temporarily unavailable.
    const shelf = await recommendationsService.readBookshelfCatalog().catch(() => []);
    return getSitemapEntries(items, topics, shelf);
}
