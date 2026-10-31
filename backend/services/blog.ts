import "server-only";
import { fetchBlogFeed } from "@/backend/integrations/blog/rss";
import type { BlogPostType } from "@/shared/contracts/blog";

async function getBlogPosts(): Promise<BlogPostType[]> {
    try {
        const feed = await fetchBlogFeed();
        return feed.items.map(item => ({
            title: item.title ?? "Untitled post",
            slug: item.link?.split("/").filter(Boolean).pop() ?? "",
            brief: item.contentSnippet ?? item.content ?? "",
            publishedAt: item.pubDate ?? null,
            url: item.link ?? "https://blog.virajnikam.in",
        })).filter(item => item.title && item.url);
    } catch {
        return [];
    }
}

export const blogService = { getBlogPosts };
