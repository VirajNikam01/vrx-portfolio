import {
    readRecommendationBySlug,
    readTopicsByRecommendationId,
} from "@/features/recommendations/repository";
import type { NextRequest } from "next/server";

export async function GET(
    _req: NextRequest,
    ctx: RouteContext<"/api/recommendations/[slug]/topics">,
) {
    const { slug } = await ctx.params;
    const recommendation = await readRecommendationBySlug(slug);

    if (!recommendation) {
        return Response.json({ error: "Recommendation not found" }, { status: 404 });
    }

    const topics = await readTopicsByRecommendationId(recommendation.id);

    return Response.json({ data: topics });
}
