import { readRecommendations, readFeaturedRecommendations } from "@/features/recommendations/repository";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";

    const items = featured
        ? await readFeaturedRecommendations()
        : await readRecommendations();

    return Response.json({ data: items });
}
