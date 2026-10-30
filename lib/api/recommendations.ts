import axios from "@/config/axios";
import type { RecommendationItem } from "@/shared/contracts/recommendations";

async function fetchRecommendations(): Promise<RecommendationItem[]> {
    try {
        const response = await axios.get<{ data: RecommendationItem[] }>(
            "/recommendations",
        );
        if (!response.data?.data) return [];
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        return [];
    }
}

async function fetchFeaturedRecommendations(): Promise<RecommendationItem[]> {
    try {
        const response = await axios.get<{ data: RecommendationItem[] }>(
            "/recommendations?featured=true",
        );
        if (!response.data?.data) return [];
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch featured recommendations:", error);
        return [];
    }
}

async function fetchRecommendationBySlug(
    slug: string,
): Promise<RecommendationItem | null> {
    try {
        const response = await axios.get<{ data: RecommendationItem }>(
            `/recommendations/${slug}`,
        );
        return response.data?.data ?? null;
    } catch (error) {
        console.error(`Failed to fetch recommendation [${slug}]:`, error);
        return null;
    }
}

export const recommendationsAction = {
    fetchRecommendations,
    fetchFeaturedRecommendations,
    fetchRecommendationBySlug,
};
