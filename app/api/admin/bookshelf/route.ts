import { recommendationsService } from "@/backend/services/recommendations";
import { adminItemSchema } from "@/shared/contracts/bookshelf-admin";
import { adminRequest, privateJson, readAdminBody, refreshAdminModule } from "../request";

export async function GET(request: Request) { return adminRequest(request, async () => privateJson({ data: await recommendationsService.readAdminItems() })); }
export async function POST(request: Request) {
    return adminRequest(request, async () => {
        const item = await recommendationsService.createAdminItem(await readAdminBody(request, adminItemSchema));
        refreshAdminModule("bookshelf");
        return privateJson({ data: item }, 201);
    });
}
