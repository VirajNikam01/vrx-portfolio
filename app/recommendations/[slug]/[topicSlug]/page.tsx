import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import {
    readAllTopicSlugs,
    readRecommendationBySlug,
    readTopicBySlug,
    readTopicsByRecommendationId,
} from "@/features/recommendations/repository";
import { TopicDetail } from "@/features/recommendations/components/topic-detail";

type Props = PageProps<"/recommendations/[slug]/[topicSlug]">;

export async function generateStaticParams() {
    const pairs = await readAllTopicSlugs();
    return pairs.map((pair) => ({
        slug: pair.recommendationSlug,
        topicSlug: pair.topicSlug,
    }));
}

import { getSiteUrl, serializeJsonLd, seoConfig } from "@/config/seo";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, topicSlug } = await params;
    const recommendation = await readRecommendationBySlug(slug);
    const topic = await readTopicBySlug(slug, topicSlug);

    if (!recommendation || !topic) return {};

    const url = getSiteUrl(`/recommendations/${slug}/${topicSlug}`);
    const title = `${topic.title} — ${recommendation.title} Notes`;
    const description = `Detailed notes and code walkthrough for ${topic.title} from ${recommendation.title} by ${recommendation.author}.`;

    return {
        title: `${title} — Viraj Nikam`,
        description,
        keywords: [
            topic.title,
            `${topic.title} notes`,
            `${recommendation.title} notes`,
            recommendation.author,
            "Viraj Nikam Recommendations",
        ],
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Viraj Nikam",
            type: "article",
            images: recommendation.coverImageUrl
                ? [{ url: recommendation.coverImageUrl }]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: recommendation.coverImageUrl
                ? [recommendation.coverImageUrl]
                : [],
        },
    };
}

export default async function TopicDetailPage({ params }: Props) {
    const { slug, topicSlug } = await params;
    const recommendation = await readRecommendationBySlug(slug);

    if (!recommendation) {
        notFound();
    }

    const topic = await readTopicBySlug(slug, topicSlug);

    if (!topic) {
        notFound();
    }

    const allTopics = await readTopicsByRecommendationId(recommendation.id);

    const topicJsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: topic.title,
        description: `Notes for ${topic.title} from ${recommendation.title}`,
        url: getSiteUrl(`/recommendations/${slug}/${topicSlug}`),
        author: {
            "@type": "Person",
            name: "Viraj Nikam",
            url: getSiteUrl("/"),
        },
        publisher: {
            "@type": "Person",
            name: "Viraj Nikam",
            url: getSiteUrl("/"),
        },
        isPartOf: {
            "@type": "WebPage",
            name: recommendation.title,
            url: getSiteUrl(`/recommendations/${slug}`),
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": getSiteUrl(`/recommendations/${slug}/${topicSlug}`),
        },
    };

    return (
        <main className="relative min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_38%),linear-gradient(to_bottom,_rgba(255,255,255,0.96),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(to_bottom,_rgba(9,9,11,0.96),_rgba(9,9,11,1))]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serializeJsonLd(topicJsonLd),
                }}
            />
            <SiteHeader />
            <div className="relative z-10">
                <section className="px-6 py-20">
                    <div className="mx-auto w-full max-w-3xl">
                        <TopicDetail
                            recommendation={recommendation}
                            topic={topic}
                            allTopics={allTopics}
                        />
                    </div>
                </section>
                <SiteFooter />
            </div>
        </main>
    );
}

