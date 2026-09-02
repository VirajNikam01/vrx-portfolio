import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/config/seo";
import { readRecommendations } from "@/features/recommendations/repository";

type SitemapEntry = {
    url: string;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
    priority: number;
};

const staticSitemapEntries: SitemapEntry[] = [
    {
        url: "/",
        changeFrequency: "monthly",
        priority: 1,
    },
    {
        url: "/blogs",
        changeFrequency: "monthly",
        priority: 0.8,
    },
    {
        url: "/recommendations",
        changeFrequency: "monthly",
        priority: 0.8,
    },
    {
        url: "/installation",
        changeFrequency: "yearly",
        priority: 0.6,
    },
    {
        url: "/theme",
        changeFrequency: "yearly",
        priority: 0.6,
    },
    {
        url: "/work-experience",
        changeFrequency: "yearly",
        priority: 0.6,
    },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Dynamic recommendation detail pages (only those with notes)
    let recommendationEntries: SitemapEntry[] = [];
    try {
        const items = await readRecommendations();
        recommendationEntries = items
            .filter((item) => item.notes !== null)
            .map((item) => ({
                url: `/recommendations/${item.slug}`,
                changeFrequency: "monthly" as const,
                priority: 0.7,
            }));
    } catch {
        // DB may not be available at build time — degrade gracefully
    }

    return [...staticSitemapEntries, ...recommendationEntries].map((entry) => ({
        url: getSiteUrl(entry.url),
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
    }));
}
