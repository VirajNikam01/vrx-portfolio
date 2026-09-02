import { readRecommendationBySlug } from "@/features/recommendations/repository";
import type { NextRequest } from "next/server";

export async function GET(
    _req: NextRequest,
    ctx: RouteContext<"/api/recommendations/[slug]">,
) {
    const { slug } = await ctx.params;
    const item = await readRecommendationBySlug(slug);

    if (!item) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ data: item });
}
