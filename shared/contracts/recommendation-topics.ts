export type RecommendationTopicItem = {
    id: number;
    recommendationId: number;
    slug: string;
    title: string;
    sortOrder: number;
    content: string;
    isPublished: boolean;
};

export type RecommendationTopicSummary = {
    id: number;
    recommendationId: number;
    slug: string;
    title: string;
    sortOrder: number;
    isPublished: boolean;
};
