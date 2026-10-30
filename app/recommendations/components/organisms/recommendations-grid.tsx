"use client";

import { useState } from "react";
import { BookOpenIcon, GraduationCapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRecommendations } from "@/hooks/recommendations/useRecommendations";
import { RecommendationCard } from "@/app/recommendations/components/molecules/recommendation-card";
import type { RecommendationCategory, RecommendationType } from "@/shared/contracts/recommendations";

const typeOptions: { value: RecommendationType | "all"; label: string; icon?: React.ReactNode }[] = [
    { value: "book", label: "Books", icon: <BookOpenIcon className="size-4" /> },
];


export function RecommendationsGrid() {
    const [activeType, setActiveType] = useState<RecommendationType>("book");
    const [activeCategory, setActiveCategory] = useState<RecommendationCategory | "all">("all");

    const { data: items = [], isLoading } = useRecommendations();



    return (
        <div className="space-y-8">


            {/* Grid */}
            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
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
            ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">
                    Nothing here yet — check back soon.
                </p>
            )}
        </div>
    );
}
