import type { MetadataRoute } from "next";
import { getSiteUrl, seoConfig } from "@/config/seo";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: seoConfig.title,
        short_name: seoConfig.shortTitle,
        description: seoConfig.description,
        start_url: getSiteUrl("/"),
        scope: getSiteUrl("/"),
        display: "standalone",
        background_color: "#09090b",
        theme_color: "#09090b",
        categories: ["portfolio", "developer", "software"],
        lang: "en-IN",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
