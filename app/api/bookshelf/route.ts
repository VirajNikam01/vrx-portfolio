import { recommendationsService } from "@/backend/services/recommendations";

export async function GET() {
    try {
        return Response.json({ data: await recommendationsService.readBookshelfCatalog() });
    } catch {
        return Response.json({ error: "Bookshelf is temporarily unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }
}
