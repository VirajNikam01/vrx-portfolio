import "server-only";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import type { NextRequest } from "next/server";

export async function GET(
    _req: NextRequest,
    ctx: RouteContext<"/api/recommendations/[slug]/topics/[topicSlug]">,
) {
    const { slug, topicSlug } = await ctx.params;
    const topic = await recommendationTopicsService.readTopicBySlug(slug, topicSlug);

    if (!topic) {
        return Response.json({ error: "Topic not found" }, { status: 404 });
    }

    return Response.json({ data: topic });
}
