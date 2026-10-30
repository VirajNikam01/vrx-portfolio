import "server-only";
import { contentConfigsService } from "@/backend/services/content-configs";

export async function GET() {
    const content = await contentConfigsService.readLandingPageContent();

    return Response.json({ data: content });
}
