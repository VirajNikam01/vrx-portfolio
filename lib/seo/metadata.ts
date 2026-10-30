import "server-only";
import type { Metadata, Viewport } from "next";
import { seoConfig, seoPages } from "@/config/seo";
import { META_THEME_COLORS } from "@/config/site";
import { getSiteUrl, getRecommendationPath, getTopicPath } from "./urls";
import type { RecommendationItem } from "@/shared/contracts/recommendations";
import type { RecommendationTopicItem } from "@/shared/contracts/recommendation-topics";

type PageMetadata = {
    title: string;
    description: string;
    path: string;
    type?: "website" | "article" | "profile";
    image?: string | null;
};

export function createPageMetadata({ title, description, path, type = "website", image }: PageMetadata): Metadata {
    const url = getSiteUrl(path);
    const imageUrl = getSiteUrl(image || seoConfig.socialImage);
    const socialTitle = title === seoConfig.title ? title : `${title} | ${seoConfig.name}`;
    return {
        title: title === seoConfig.title ? { absolute: title } : title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title: socialTitle,
            description,
            url,
            siteName: seoConfig.name,
            locale: seoConfig.locale,
            type,
            images: [imageUrl],
        },
        twitter: {
            card: "summary_large_image",
            title: socialTitle,
            description,
            images: [imageUrl],
        },
    };
}

export const siteMetadata: Metadata = {
    metadataBase: new URL(getSiteUrl("/")),
    applicationName: seoConfig.shortTitle,
    title: { default: seoConfig.title, template: `%s | ${seoConfig.name}` },
    description: seoConfig.description,
    authors: [{ name: seoConfig.name, url: getSiteUrl("/") }],
    creator: seoConfig.name,
    publisher: seoConfig.name,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
};

export const siteViewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: META_THEME_COLORS.light },
        { media: "(prefers-color-scheme: dark)", color: META_THEME_COLORS.dark },
    ],
};

export const homeMetadata = createPageMetadata({ ...seoPages.home, type: "profile" });
export const blogsMetadata = createPageMetadata(seoPages.blogs);
export const recommendationsMetadata = createPageMetadata(seoPages.recommendations);

export function getRecommendationMetadata(item: RecommendationItem) {
    return createPageMetadata({
        title: `${item.title} — Notes & Summary`,
        description: item.description,
        path: getRecommendationPath(item.slug),
        type: "article",
        image: item.coverImageUrl,
    });
}

export function getTopicMetadata(recommendation: RecommendationItem, topic: RecommendationTopicItem) {
    return createPageMetadata({
        title: `${topic.title} — ${recommendation.title} Notes`,
        description: `Detailed notes and code walkthrough for ${topic.title} from ${recommendation.title} by ${recommendation.author}.`,
        path: getTopicPath(recommendation.slug, topic.slug),
        type: "article",
        image: recommendation.coverImageUrl,
    });
}
