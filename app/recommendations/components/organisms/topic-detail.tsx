import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { RecommendationNotes } from "@/app/recommendations/components/organisms/recommendation-notes";
import type { RecommendationItem } from "@/shared/contracts/recommendations";
import type { RecommendationTopicItem } from "@/shared/contracts/recommendation-topics";

type TopicDetailProps = {
    recommendation: RecommendationItem;
    topic: RecommendationTopicItem;
    allTopics: RecommendationTopicItem[];
};

export function TopicDetail({
    recommendation,
    topic,
    allTopics,
}: TopicDetailProps) {
    const currentIndex = allTopics.findIndex((t) => t.slug === topic.slug);
    const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
    const nextTopic =
        currentIndex >= 0 && currentIndex < allTopics.length - 1
            ? allTopics[currentIndex + 1]
            : null;

    return (
        <article className="space-y-8">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href={`/bookshelf/${encodeURIComponent(recommendation.slug)}`}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeftIcon className="size-3.5" />
                    Back to {recommendation.title}
                </Link>
                <span className="text-xs text-muted-foreground font-mono">
                    Topic {currentIndex + 1} of {allTopics.length}
                </span>
            </div>

            {/* Topic Title */}
            <div className="border-b border-border/60 pb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {topic.title}
                </h1>
            </div>

            {/* Topic Content */}
            <div className="rounded-xl border border-border/60 bg-background/60 p-6 backdrop-blur-sm">
                <RecommendationNotes notes={topic.content} allowHtml={false} />
            </div>

            {/* Bottom Prev/Next Topic Navigation */}
            <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
                {prevTopic ? (
                    <Link
                        href={`/recommendations/${recommendation.slug}/${prevTopic.slug}`}
                        className="group flex flex-1 items-center gap-3 rounded-xl border border-border/60 p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
                    >
                        <ArrowLeftIcon className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        <div className="min-w-0">
                            <div className="text-xs text-muted-foreground">Previous</div>
                            <div className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {prevTopic.title}
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div />
                )}

                {nextTopic ? (
                    <Link
                        href={`/recommendations/${recommendation.slug}/${nextTopic.slug}`}
                        className="group flex flex-1 items-center justify-end text-right gap-3 rounded-xl border border-border/60 p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
                    >
                        <div className="min-w-0">
                            <div className="text-xs text-muted-foreground">Next</div>
                            <div className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {nextTopic.title}
                            </div>
                        </div>
                        <ArrowRightIcon className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </Link>
                ) : (
                    <div />
                )}
            </div>
        </article>
    );
}
