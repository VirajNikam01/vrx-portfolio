import { contentConfigsService } from "@/backend/services/content-configs";
import { featureFlagsUpdateSchema } from "@/shared/contracts/site-settings";
import { adminRequest, privateJson, readAdminBody, refreshAdminModule } from "../../request";

export async function GET(request: Request) { return adminRequest(request, async () => privateJson({ data: await contentConfigsService.readAdminFeatureFlags() })); }
export async function PATCH(request: Request) {
    return adminRequest(request, async () => {
        const settings = await contentConfigsService.updateAdminFeatureFlags(await readAdminBody(request, featureFlagsUpdateSchema));
        refreshAdminModule("feature-flags");
        return privateJson({ data: settings });
    });
}
