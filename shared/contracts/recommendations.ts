export type RecommendationCategory = "tech" | "philosophy" | "other";
export type RecommendationType = "book" | "course";

export type RecommendationItem = {
    id: number;
    slug: string;
    type: RecommendationType;
    category: RecommendationCategory;
    title: string;
    author: string;
    description: string;
    coverImageUrl: string | null;
    externalUrl: string | null;
    notes: string | null;
    isFeatured: boolean;
    isVisible: boolean;
    sortOrder: number;
};
