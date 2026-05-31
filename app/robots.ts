import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/seo";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/"],
            },
            {
                userAgent: [
                    "Googlebot",
                    "Bingbot",
                    "DuckDuckBot",
                    "OAI-SearchBot",
                    "ChatGPT-User",
                    "GPTBot",
                    "ClaudeBot",
                    "Claude-SearchBot",
                    "Claude-User",
                    "PerplexityBot",
                    "Perplexity-User",
                    "Applebot",
                    "Google-Extended",
                ],
                allow: "/",
                disallow: ["/api/"],
            },
        ],
        sitemap: getSiteUrl("/sitemap.xml"),
        host: getSiteUrl("/"),
    };
}
