import "server-only";
import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import type { NextRequest } from "next/server";

export async function GET(
    _req: NextRequest,
    ctx: RouteContext<"/api/recommendations/[slug]/topics">,
) {
    const { slug } = await ctx.params;
    const recommendation = await recommendationsService.readRecommendationBySlug(slug);

    if (!recommendation) {
        return Response.json({ error: "Recommendation not found" }, { status: 404 });
    }

    const topics = await recommendationTopicsService.readTopicsByRecommendationId(recommendation.id);

    return Response.json({ data: topics });
}
