import "server-only";

import Parser from "rss-parser";
import { cacheLife } from "next/cache";

const parser = new Parser();

export type BlogPost = {
    title: string;
    slug: string;
    brief: string;
    publishedAt: string | null;
    url: string;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        const feed = await parser.parseURL(
            "https://blog.virajnikam.in/rss.xml",
        );

        return feed.items
            .map((item) => ({
                title: item.title ?? "Untitled post",
                slug: item.link?.split("/").filter(Boolean).pop() ?? "",
                brief: item.contentSnippet ?? item.content ?? "",
                publishedAt: item.pubDate ?? null,
                url: item.link ?? "https://blog.virajnikam.in",
            }))
            .filter((item) => item.title && item.url);
    } catch {
        return [];
    }
}
