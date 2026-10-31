import "server-only";
import { contentConfigsService } from "@/backend/services/content-configs";

export async function GET() {
    try {
        const content = await contentConfigsService.readLandingPageContent();
        return Response.json({ data: content });
    } catch (error) {
        console.error("Failed to load landing page content:", error);
        return Response.json(
            { error: "Landing page content is temporarily unavailable" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
        );
    }
}
