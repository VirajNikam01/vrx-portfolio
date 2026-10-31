import { notFound } from "next/navigation";
import { adminPageId, requireAdminPage } from "@/lib/admin-session";
import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { AdminTopicEditor } from "@/app/admin/components/organisms/admin-topic-editor";

export default async function NewTopicPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: value } = await params;
    await requireAdminPage(`/admin/bookshelf/${value}/topics/new`);
    const parent = await recommendationsService.readAdminItem(adminPageId(value));
    if (!parent || !["book", "course"].includes(parent.type)) notFound();
    const topics = await recommendationTopicsService.readAdminTopics(parent.id);
    return <AdminTopicEditor parent={parent} initialTopic={null} nextOrder={Math.min(2147483646, Math.max(-1, ...topics.map(topic => topic.sortOrder)) + 1)} />;
}
