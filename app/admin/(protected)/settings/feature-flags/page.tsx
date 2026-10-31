import { requireAdminPage } from "@/lib/admin-session";
import { contentConfigsService } from "@/backend/services/content-configs";
import { FeatureFlagsEditor } from "@/app/admin/components/organisms/feature-flags-editor";

export default async function FeatureFlagsPage() {
    await requireAdminPage("/admin/settings/feature-flags");
    return <FeatureFlagsEditor initialSettings={await contentConfigsService.readAdminFeatureFlags()} />;
}
