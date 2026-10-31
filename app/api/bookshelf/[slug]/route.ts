import { recommendationsService } from "@/backend/services/recommendations";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const item = await recommendationsService.readBookshelfItem((await params).slug);
        return item ? Response.json({ data: item }) : Response.json({ error: "Not found" }, { status: 404 });
    } catch {
        return Response.json({ error: "Bookshelf item is temporarily unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }
}
