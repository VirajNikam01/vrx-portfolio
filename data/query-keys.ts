export const queryKeys = {
    landingPageContent: ["landing-page-content"],
    blogPosts: ["blog-posts"],
    recommendations: ["recommendations"],
    featuredRecommendations: ["recommendations", "featured"],
    recommendationBySlug: (slug: string) => ["recommendations", slug],
}
