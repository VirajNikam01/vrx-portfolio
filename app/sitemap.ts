import { promises as fs } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/config/seo";

type SitemapEntry = {
    url: string;
    sourceFile: string;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
    priority: number;
};

const sitemapEntries: SitemapEntry[] = [
    {
        url: "/",
        sourceFile: "app/page.tsx",
        changeFrequency: "monthly",
        priority: 1,
    },
    {
        url: "/installation",
        sourceFile: "app/(docs)/installation/page.md",
        changeFrequency: "yearly",
        priority: 0.6,
    },
    {
        url: "/theme",
        sourceFile: "app/(docs)/theme/page.md",
        changeFrequency: "yearly",
        priority: 0.6,
    },
    {
        url: "/work-experience",
        sourceFile: "app/(docs)/work-experience/page.md",
        changeFrequency: "yearly",
        priority: 0.6,
    },
];

async function getLastModified(filePath: string) {
    try {
        const stats = await fs.stat(path.join(process.cwd(), filePath));
        return stats.mtime;
    } catch {
        return new Date();
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    return Promise.all(
        sitemapEntries.map(async (entry) => ({
            url: getSiteUrl(entry.url),
            lastModified: await getLastModified(entry.sourceFile),
            changeFrequency: entry.changeFrequency,
            priority: entry.priority,
        })),
    );
}
