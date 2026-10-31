import { InitialAvatar } from "@/app/components/atoms/initial-avatar";
import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRightIcon } from "lucide-react";
import { SiteHeader } from "@/app/components/organisms/layout/site-header";
import { SiteFooter } from "@/app/components/organisms/layout/site-footer";
import { Button } from "@/app/components/atoms/button";

import { RecommendationCard } from "@/app/recommendations/components/molecules/recommendation-card";
import { RecommendationNotes } from "@/app/recommendations/components/organisms/recommendation-notes";
import { TopicList } from "@/app/recommendations/components/organisms/topic-list";

import { JsonLd } from "@/app/components/atoms/json-ld";
import { getRecommendationMetadata } from "@/lib/seo/metadata";
import { getRecommendationJsonLd } from "@/lib/seo/structured-data";

type Props = PageProps<"/recommendations/[slug]">;

export async function generateStaticParams() {
    const items = await recommendationsService.readRecommendations();
    return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const item = await recommendationsService.readRecommendationBySlug(slug);
    if (!item) return {};

    return getRecommendationMetadata(item);
}

export default async function RecommendationDetailPage({ params }: Props) {
    const { slug } = await params;
    const item = await recommendationsService.readRecommendationBySlug(slug);

    if (!item) {
        notFound();
    }

    const topics = await recommendationTopicsService.readTopicsByRecommendationId(item.id);

    // Fetch related items (same category, exclude current)
    const related = await recommendationsService.readRelatedRecommendations(item.slug, item.category);

    const structuredData = getRecommendationJsonLd(item, topics);

    return (
        <main className="relative min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_38%),linear-gradient(to_bottom,_rgba(255,255,255,0.96),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(to_bottom,_rgba(9,9,11,0.96),_rgba(9,9,11,1))]">
            <JsonLd data={structuredData} />
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
                                <InitialAvatar title={item.title} className="h-28 w-20 rounded-xl text-4xl shadow-md" />
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
