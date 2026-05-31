import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: getSiteUrl("/"),
            lastModified: new Date("2026-05-31"),
            changeFrequency: "monthly",
            priority: 1,
        },
    ];
}
