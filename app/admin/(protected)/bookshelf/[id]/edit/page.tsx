import { notFound } from "next/navigation";
import { adminPageId, requireAdminPage } from "@/lib/admin-session";
import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { AdminItemEditor } from "@/app/admin/components/organisms/admin-item-editor";

export default async function EditItemPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ preview?: string }> }) {
    const { id: value } = await params;
    await requireAdminPage(`/admin/bookshelf/${value}/edit`);
    const item = await recommendationsService.readAdminItem(adminPageId(value));
    if (!item) notFound();
    const topics = await recommendationTopicsService.readAdminTopics(item.id);
    return <AdminItemEditor initialItem={item} topics={topics} startPreview={(await searchParams).preview === "1"} />;
}
