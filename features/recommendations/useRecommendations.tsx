"use client";

import { useQuery } from "@tanstack/react-query";
import { recommendationsAction } from "@/actions/recommendations";
import { queryKeys } from "@/data/query-keys";
import type { RecommendationItem } from "./types";

export function useRecommendations() {
    return useQuery<RecommendationItem[]>({
        queryKey: queryKeys.recommendations,
        queryFn: recommendationsAction.fetchRecommendations,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

export function useFeaturedRecommendations() {
    return useQuery<RecommendationItem[]>({
        queryKey: queryKeys.featuredRecommendations,
        queryFn: recommendationsAction.fetchFeaturedRecommendations,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

export function useRecommendationBySlug(slug: string) {
    return useQuery<RecommendationItem | null>({
        queryKey: queryKeys.recommendationBySlug(slug),
        queryFn: () => recommendationsAction.fetchRecommendationBySlug(slug),
        initialData: null,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
