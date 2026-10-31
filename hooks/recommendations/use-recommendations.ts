"use client";

import { useQuery } from "@tanstack/react-query";
import { recommendationsApi } from "@/lib/api/recommendations";
import { queryKeys } from "@/data/query-keys";
import type { RecommendationItem } from "@/shared/contracts/recommendations";

export function useRecommendations() {
    return useQuery<RecommendationItem[]>({
        queryKey: queryKeys.recommendations,
        queryFn: recommendationsApi.fetchRecommendations,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

export function useFeaturedRecommendations() {
    return useQuery<RecommendationItem[]>({
        queryKey: queryKeys.featuredRecommendations,
        queryFn: recommendationsApi.fetchFeaturedRecommendations,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

export function useRecommendationBySlug(slug: string) {
    return useQuery<RecommendationItem | null>({
        queryKey: queryKeys.recommendationBySlug(slug),
        queryFn: () => recommendationsApi.fetchRecommendationBySlug(slug),
        initialData: null,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
