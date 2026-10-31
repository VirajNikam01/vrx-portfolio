import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import type { BookshelfItem } from "@/shared/contracts/bookshelf";
import type { RecommendationTopicSummary } from "@/shared/contracts/recommendation-topics";
import { bookshelfLabels, bookshelfSourceLabels } from "@/shared/contracts/bookshelf";
import { BookshelfCover } from "@/app/bookshelf/components/molecules/bookshelf-cover";
import { RecommendationNotes } from "@/app/recommendations/components/organisms/recommendation-notes";
import { getTopicPath } from "@/lib/seo/urls";

export function BookshelfReader({ item, topics }: { item: BookshelfItem; topics: RecommendationTopicSummary[] }) {
    return (
        <article className="min-w-0 space-y-8 break-words [overflow-wrap:anywhere]">
            <header className="flex items-start gap-5">
                <div className="w-20 shrink-0 sm:w-24"><BookshelfCover item={item} compact /></div>
                <div className="min-w-0 space-y-3">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">{bookshelfLabels[item.type]}</span>
                    <h2 id="bookshelf-reader-title" tabIndex={-1} className="scroll-mt-36 text-2xl font-semibold tracking-tight outline-none sm:text-3xl">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">{item.author}</p>
                </div>
            </header>
            <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
            {item.tags.length > 0 && <ul aria-label="Tags" className="flex flex-wrap gap-2">{item.tags.map(tag => (
                <li key={tag} className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">{tag}</li>
            ))}</ul>}
            {item.externalUrl && (
                <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {bookshelfSourceLabels[item.type]}<ArrowUpRightIcon aria-hidden className="size-4" /><span className="sr-only"> (opens in a new tab)</span>
                </a>
            )}
            <section className="border-t border-border pt-6 [&_pre]:max-w-full [&_pre]:overflow-x-auto">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.type === "note" ? "Note" : "Personal notes"}</h3>
                {item.notes?.trim() ? <RecommendationNotes notes={item.notes} allowHtml={false} /> : <p className="text-sm text-muted-foreground">Personal notes coming soon.</p>}
            </section>
            {topics.length > 0 && <section className="border-t border-border pt-6">
                <h3 className="mb-4 font-semibold">Explore the notes</h3>
                <ul className="space-y-2">{topics.map(topic => (
                    <li key={topic.id}><Link href={getTopicPath(item.slug, topic.slug)} className="inline-flex min-h-11 items-center gap-2 text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{topic.title}<ArrowUpRightIcon aria-hidden className="size-3.5" /></Link></li>
                ))}</ul>
            </section>}
        </article>
    );
}
