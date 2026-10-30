import "server-only";
import { recommendationsService } from "@/backend/services/recommendations";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";

    const items = featured
        ? await recommendationsService.readFeaturedRecommendations()
        : await recommendationsService.readRecommendations();

    return Response.json({ data: items });
}
