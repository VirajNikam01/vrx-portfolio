import Link from "next/link";
import { ChevronRightIcon, FileTextIcon } from "lucide-react";
import type { RecommendationTopicItem } from "@/shared/contracts/recommendation-topics";

type TopicListProps = {
    recommendationSlug: string;
    topics: RecommendationTopicItem[];
};

export function TopicList({ recommendationSlug, topics }: TopicListProps) {
    if (topics.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <FileTextIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Table of Contents ({topics.length})
                </h2>
            </div>

            <div className="grid gap-3">
                {topics.map((topic, index) => {
                    const stepNumber = String(index + 1).padStart(2, "0");
                    return (
                        <Link
                            key={topic.id}
                            href={`/recommendations/${recommendationSlug}/${topic.slug}`}
                            className="group flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/40 hover:bg-accent/40 hover:shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-mono font-semibold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    {stepNumber}
                                </span>
                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                    {topic.title}
                                </span>
                            </div>
                            <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
