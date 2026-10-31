import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { bookshelfAdminService } from "@/backend/services/bookshelf-admin";
import { adminTopicSchema } from "@/shared/contracts/bookshelf-admin";
import { adminId, adminRequest, privateJson, readAdminBody, refreshAdminModule } from "../../../request";

type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
    return adminRequest(request, async () => {
        const id = adminId((await context.params).id);
        if (!await recommendationsService.readAdminItem(id)) return privateJson({ error: "Item not found" }, 404);
        return privateJson({ data: await recommendationTopicsService.readAdminTopics(id) });
    });
}
export async function POST(request: Request, context: Context) {
    return adminRequest(request, async () => {
        const topic = await bookshelfAdminService.saveTopic(adminId((await context.params).id), await readAdminBody(request, adminTopicSchema));
        refreshAdminModule("bookshelf");
        return privateJson({ data: topic }, 201);
    });
}
