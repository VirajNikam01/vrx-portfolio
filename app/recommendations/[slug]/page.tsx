import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeftIcon, ArrowUpRightIcon, BookOpenIcon, GraduationCapIcon } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    readRecommendationBySlug,
    readRecommendations,
    readTopicsByRecommendationId,
} from "@/features/recommendations/repository";
import { RecommendationCard } from "@/features/recommendations/components/recommendation-card";
import { RecommendationNotes } from "@/features/recommendations/components/recommendation-notes";
import { TopicList } from "@/features/recommendations/components/topic-list";
import { cn } from "@/lib/utils";

type Props = PageProps<"/recommendations/[slug]">;

export async function generateStaticParams() {
    const items = await readRecommendations();
    return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const item = await readRecommendationBySlug(slug);
    if (!item) return {};
    return {
        title: `${item.title} — Recommendations — Viraj Nikam`,
        description: item.description,
    };
}

const categoryColors: Record<string, string> = {
    tech: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    philosophy: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    other: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

const categoryLabels: Record<string, string> = {
    tech: "Tech",
    philosophy: "Philosophy",
    other: "Other",
};

function LetterAvatar({ title }: { title: string }) {
    const initial = title.trim()[0]?.toUpperCase() ?? "?";
    const colors = [
        "from-blue-500 to-indigo-600",
        "from-purple-500 to-pink-600",
        "from-emerald-500 to-teal-600",
        "from-orange-500 to-amber-600",
        "from-rose-500 to-red-600",
    ];
    const color = colors[title.charCodeAt(0) % colors.length];
    return (
        <div
            className={cn(
                "flex h-28 w-20 items-center justify-center rounded-xl bg-gradient-to-br text-4xl font-bold text-white shadow-md",
                color,
            )}
        >
            {initial}
        </div>
    );
}

export default async function RecommendationDetailPage({ params }: Props) {
    const { slug } = await params;
    const item = await readRecommendationBySlug(slug);

    if (!item) {
        notFound();
    }

    const topics = await readTopicsByRecommendationId(item.id);

    // Fetch related items (same category, exclude current)
    const allItems = await readRecommendations();
    const related = allItems
        .filter((r) => r.slug !== item.slug && r.category === item.category)
        .slice(0, 3);

    const TypeIcon = item.type === "book" ? BookOpenIcon : GraduationCapIcon;

    return (
        <main className="relative min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_38%),linear-gradient(to_bottom,_rgba(255,255,255,0.96),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(to_bottom,_rgba(9,9,11,0.96),_rgba(9,9,11,1))]">
            <SiteHeader />
            <div className="relative z-10">
                <article className="px-6 py-20">
                    <div className="mx-auto w-full max-w-3xl">
                        <Link
                            href="/recommendations"
                            className="border-2 text-primary px-2 rounded-xl cursor-pointer"
                        >
                            All recommendations
                        </Link>

                        <div className="my-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                            {item.coverImageUrl ? (
                                <img
                                    src={item.coverImageUrl}
                                    alt={item.title}
                                    className="h-32 w-24 shrink-0 rounded-xl object-cover shadow-md"
                                />
                            ) : (
                                <LetterAvatar title={item.title} />
                            )}

                            <div className="space-y-3">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    {item.title}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    by {item.author}
                                </p>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {item.description}
                                </p>

                                {item.externalUrl && (
                                    <Button asChild size="sm" className="gap-1.5">
                                        <Link
                                            href={item.externalUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {item.type === "book" ? "Get book" : "Enroll"}
                                            <ArrowUpRightIcon className="size-3.5" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Topics or Legacy Notes */}
                        {topics.length > 0 ? (
                            <TopicList recommendationSlug={item.slug} topics={topics} />
                        ) : item.notes ? (
                            <div className="rounded-xl border border-border/60 bg-background/60 p-6 backdrop-blur-sm">
                                <RecommendationNotes notes={item.notes} />
                            </div>
                        ) : (
                            <p className="rounded-xl border border-border/60 bg-muted/40 p-6 text-sm text-muted-foreground">
                                Notes coming soon.
                            </p>
                        )}

                        {/* Related */}
                        {related.length > 0 && (
                            <div className="mt-16 space-y-6">
                                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                                    You might also like
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {related.map((r) => (
                                        <RecommendationCard key={r.slug} item={r} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>

                <SiteFooter />
            </div>
        </main>
    );
}
