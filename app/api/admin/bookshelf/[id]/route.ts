import { recommendationsService } from "@/backend/services/recommendations";
import { bookshelfAdminService } from "@/backend/services/bookshelf-admin";
import { adminItemSchema } from "@/shared/contracts/bookshelf-admin";
import { adminId, adminRequest, privateJson, readAdminBody, refreshAdminModule } from "../../request";

type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
    return adminRequest(request, async () => {
        const item = await recommendationsService.readAdminItem(adminId((await context.params).id));
        return item ? privateJson({ data: item }) : privateJson({ error: "Item not found" }, 404);
    });
}
export async function PATCH(request: Request, context: Context) {
    return adminRequest(request, async () => {
        const item = await bookshelfAdminService.updateItem(adminId((await context.params).id), await readAdminBody(request, adminItemSchema));
        refreshAdminModule("bookshelf");
        return privateJson({ data: item });
    });
}
