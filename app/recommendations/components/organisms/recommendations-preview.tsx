"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/app/components/atoms/button";
import type { RecommendationItem } from "@/shared/contracts/recommendations";
import { useFeaturedRecommendations } from "@/hooks/recommendations/use-recommendations";
import { RecommendationCard } from "@/app/recommendations/components/molecules/recommendation-card";

type RecommendationsPreviewProps = {
    items?: RecommendationItem[];
};

export function RecommendationsPreview({ items: initialItems }: RecommendationsPreviewProps = {}) {
    const { data: fetchedItems = [], isLoading } = useFeaturedRecommendations();
    const items = initialItems?.length ? initialItems : fetchedItems;

    return (
        <section id="recommendations" className="px-6 py-20">
            <div className="mx-auto w-full max-w-5xl">
                {/* Header */}
                <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-semibold tracking-tight text-primary">
                            Recommendations
                        </h2>
                        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                            Books and courses that shaped how I think and build.
                        </p>
                    </div>

                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-fit gap-1.5 text-sm font-medium"
                    >
                        <Link href="/recommendations">
                            See all
                            <ArrowRightIcon className="size-3.5" />
                        </Link>
                    </Button>
                </div>

                {/* Featured grid */}
                {isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-52 animate-pulse rounded-xl bg-muted"
                            />
                        ))}
                    </div>
                ) : items.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                            <RecommendationCard key={item.slug} item={item} />
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    );
}
