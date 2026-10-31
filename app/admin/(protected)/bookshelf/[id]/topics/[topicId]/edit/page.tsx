import { notFound } from "next/navigation";
import { adminPageId, requireAdminPage } from "@/lib/admin-session";
import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { AdminTopicEditor } from "@/app/admin/components/organisms/admin-topic-editor";

export default async function EditTopicPage({ params }: { params: Promise<{ id: string; topicId: string }> }) {
    const { id: value, topicId } = await params;
    await requireAdminPage(`/admin/bookshelf/${value}/topics/${topicId}/edit`);
    const parent = await recommendationsService.readAdminItem(adminPageId(value));
    if (!parent || !["book", "course"].includes(parent.type)) notFound();
    const topic = await recommendationTopicsService.readAdminTopic(parent.id, adminPageId(topicId));
    if (!topic) notFound();
    return <AdminTopicEditor parent={parent} initialTopic={topic} />;
}
