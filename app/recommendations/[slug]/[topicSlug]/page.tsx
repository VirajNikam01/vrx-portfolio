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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, topicSlug } = await params;
    const recommendation = await readRecommendationBySlug(slug);
    const topic = await readTopicBySlug(slug, topicSlug);

    if (!recommendation || !topic) return {};

    return {
        title: `${topic.title} — ${recommendation.title} — Viraj Nikam`,
        description: `Notes on ${topic.title} from ${recommendation.title} by ${recommendation.author}`,
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

    return (
        <main className="relative min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_38%),linear-gradient(to_bottom,_rgba(255,255,255,0.96),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(to_bottom,_rgba(9,9,11,0.96),_rgba(9,9,11,1))]">
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
