import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/config/seo";

type SitemapEntry = {
    url: string;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
    priority: number;
};

const sitemapEntries: SitemapEntry[] = [
    {
        url: "/",
        changeFrequency: "monthly",
        priority: 1,
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

export default function sitemap(): MetadataRoute.Sitemap {
    return sitemapEntries.map((entry) => ({
        url: getSiteUrl(entry.url),
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
    }));
}
