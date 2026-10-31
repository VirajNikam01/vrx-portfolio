import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { bookshelfAdminService } from "@/backend/services/bookshelf-admin";
import { adminTopicSchema } from "@/shared/contracts/bookshelf-admin";
import { adminId, adminRequest, privateJson, readAdminBody, refreshAdminModule } from "../../../../request";

type Context = { params: Promise<{ id: string; topicId: string }> };
export async function GET(request: Request, context: Context) {
    return adminRequest(request, async () => {
        const params = await context.params;
        const id = adminId(params.id);
        if (!await recommendationsService.readAdminItem(id)) return privateJson({ error: "Item not found" }, 404);
        const topic = await recommendationTopicsService.readAdminTopic(id, adminId(params.topicId));
        return topic ? privateJson({ data: topic }) : privateJson({ error: "Topic not found" }, 404);
    });
}
export async function PATCH(request: Request, context: Context) {
    return adminRequest(request, async () => {
        const params = await context.params;
        const topic = await bookshelfAdminService.saveTopic(adminId(params.id), await readAdminBody(request, adminTopicSchema), adminId(params.topicId));
        refreshAdminModule("bookshelf");
        return privateJson({ data: topic });
    });
}
