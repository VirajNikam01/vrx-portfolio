import { requireAdminPage } from "@/lib/admin-session";
import { recommendationsService } from "@/backend/services/recommendations";
import { AdminItemEditor } from "@/app/admin/components/organisms/admin-item-editor";

export default async function NewItemPage() {
    await requireAdminPage("/admin/bookshelf/new");
    const items = await recommendationsService.readAdminItems();
    const nextOrder = Math.min(2147483646, Math.max(-1, ...items.map(item => item.sortOrder)) + 1);
    return <AdminItemEditor initialItem={null} nextOrder={nextOrder} />;
}
