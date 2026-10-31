import { requireAdminPage } from "@/lib/admin-session";
import { recommendationsService } from "@/backend/services/recommendations";
import { AdminDashboard } from "@/app/admin/components/organisms/admin-dashboard";

export default async function AdminBookshelfPage() {
    await requireAdminPage();
    return <AdminDashboard initialItems={await recommendationsService.readAdminItems()} />;
}
