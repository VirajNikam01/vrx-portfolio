import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/organisms/layout/site-header";
import { SiteFooter } from "@/app/components/organisms/layout/site-footer";

import { TopicDetail } from "@/app/recommendations/components/organisms/topic-detail";

import { JsonLd } from "@/app/components/atoms/json-ld";
import { getTopicMetadata } from "@/lib/seo/metadata";
import { getTopicJsonLd } from "@/lib/seo/structured-data";

type Props = PageProps<"/recommendations/[slug]/[topicSlug]">;

export async function generateStaticParams() {
    const pairs = await recommendationTopicsService.readAllTopicSlugs();
    return pairs.map((pair) => ({
        slug: pair.recommendationSlug,
        topicSlug: pair.topicSlug,
    }));
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, topicSlug } = await params;
    const recommendation = await recommendationsService.readRecommendationBySlug(slug);
    const topic = await recommendationTopicsService.readTopicBySlug(slug, topicSlug);

    if (!recommendation || !topic) return {};

    return getTopicMetadata(recommendation, topic);
}

export default async function TopicDetailPage({ params }: Props) {
    const { slug, topicSlug } = await params;
    const recommendation = await recommendationsService.readRecommendationBySlug(slug);

    if (!recommendation) {
        notFound();
    }

    const topic = await recommendationTopicsService.readTopicBySlug(slug, topicSlug);

    if (!topic) {
        notFound();
    }

    const allTopics = await recommendationTopicsService.readTopicsByRecommendationId(recommendation.id);

    const structuredData = getTopicJsonLd(recommendation, topic);

    return (
        <main className="relative min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_38%),linear-gradient(to_bottom,_rgba(255,255,255,0.96),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(to_bottom,_rgba(9,9,11,0.96),_rgba(9,9,11,1))]">
            <JsonLd data={structuredData} />
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

