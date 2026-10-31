import { cache } from "react";
import { notFound } from "next/navigation";
import { recommendationsService } from "@/backend/services/recommendations";
import { recommendationTopicsService } from "@/backend/services/recommendation-topics";
import { BookshelfReader } from "@/app/bookshelf/components/organisms/bookshelf-reader";
import { getBookshelfItemMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };
const readItem = cache(recommendationsService.readBookshelfItem);
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
    const item = await readItem((await params).slug);
    if (!item) notFound();
    return getBookshelfItemMetadata(item);
}

export default async function BookshelfItemPage({ params }: Props) {
    const item = await readItem((await params).slug);
    if (!item) notFound();
    const topics = item.type === "book" || item.type === "course"
        ? await recommendationTopicsService.readTopicsByRecommendationId(item.id) : [];
    return <BookshelfReader item={item} topics={topics.filter(topic => topic.isPublished).map(({ id, recommendationId, slug, title, sortOrder, isPublished }) => ({ id, recommendationId, slug, title, sortOrder, isPublished }))} />;
}
