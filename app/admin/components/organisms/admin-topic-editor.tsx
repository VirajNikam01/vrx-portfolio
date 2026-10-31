"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminTopicSchema, suggestSlug, type AdminItem, type AdminTopic, type AdminTopicInput } from "@/shared/contracts/bookshelf-admin";
import { adminFetch, AdminRequestError } from "@/lib/api/admin";
import { useUnsavedChanges } from "@/hooks/admin/use-unsaved-changes";
import { AdminField, adminInputClass, adminButtonClass, adminSecondaryClass } from "@/app/admin/components/molecules/admin-field";
import { AdminSaveError } from "@/app/admin/components/molecules/admin-save-error";
import { RecommendationNotes } from "@/app/recommendations/components/organisms/recommendation-notes";

function editableTopic(topic: AdminTopic | null, order: number): AdminTopicInput {
    return { title: topic?.title ?? "", slug: topic?.slug ?? "", content: topic?.content ?? "", sortOrder: topic?.sortOrder ?? order, isPublished: topic?.isPublished ?? false, ...(topic ? { version: topic.version } : {}) };
}
export function AdminTopicEditor({ parent, initialTopic, nextOrder = 0 }: { parent: AdminItem; initialTopic: AdminTopic | null; nextOrder?: number }) {
    const router = useRouter();
    const [saved, setSaved] = useState(initialTopic);
    const [form, setForm] = useState(() => editableTopic(initialTopic, nextOrder));
    const [baseline, setBaseline] = useState(() => JSON.stringify(editableTopic(initialTopic, nextOrder)));
    const [slugEdited, setSlugEdited] = useState(Boolean(initialTopic));
    const [preview, setPreview] = useState(false);
    const [pending, setPending] = useState(false);
    const [fields, setFields] = useState<Record<string, string[]>>({});
    const [error, setError] = useState<Error | null>(null);
    const [message, setMessage] = useState("");
    const dirty = JSON.stringify(form) !== baseline;
    useUnsavedChanges(dirty);
    async function save(isPublished: boolean) {
        if (saved?.isPublished && !isPublished && !confirm(`Unpublish “${form.title}” and save your changes?`)) return;
        const result = adminTopicSchema.safeParse({ ...form, isPublished });
        setMessage(""); setError(null); setFields({});
        if (!result.success) {
            const next: Record<string, string[]> = {};
            for (const issue of result.error.issues) (next[String(issue.path[0])] ??= []).push(issue.message);
            setFields(next); setError(new Error("Please check the highlighted fields.")); setPreview(false); return;
        }
        setPending(true);
        try {
            const topic = await adminFetch<AdminTopic>(`/bookshelf/${parent.id}/topics${saved ? `/${saved.id}` : ""}`, saved ? "PATCH" : "POST", result.data);
            const next = editableTopic(topic, nextOrder);
            setSaved(topic); setForm(next); setBaseline(JSON.stringify(next)); setSlugEdited(true);
            setMessage(topic.isPublished ? parent.isVisible ? "Topic published." : "Topic saved. It stays private while its parent is hidden." : "Topic draft saved.");
            if (!saved) router.replace(`/admin/bookshelf/${parent.id}/topics/${topic.id}/edit`);
        } catch (failure) { setError(failure instanceof Error ? failure : new Error("Unable to save")); if (failure instanceof AdminRequestError) setFields(failure.fields); }
        finally { setPending(false); }
    }
    return <div className="mx-auto max-w-4xl space-y-7">
        <Link href={`/admin/bookshelf/${parent.id}/edit`} className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">← {parent.title}</Link>
        <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-3xl font-semibold">{saved ? "Edit topic" : "Add topic"}</h1><button type="button" className={adminSecondaryClass} onClick={() => setPreview(!preview)}>{preview ? "Back to editor" : "Preview notes"}</button></div>
        {!parent.isVisible && <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">The parent item is hidden. Its topics will stay private until the parent is published.</p>}
        <AdminSaveError error={error} />
        {message && <p role="status" className="rounded-lg bg-primary/10 p-4 text-sm text-primary">{message}</p>}
        <form onSubmit={event => { event.preventDefault(); void save(form.isPublished); }} className="space-y-6 rounded-2xl border border-border bg-card p-5 sm:p-8">
            <AdminField label="Topic title" name="title" error={fields.title}><input id="title" required maxLength={250} value={form.title} onChange={event => { const title = event.target.value; setForm(current => ({ ...current, title, ...(!slugEdited && !saved ? { slug: suggestSlug(title) } : {}) })); }} className={adminInputClass} /></AdminField>
            <AdminField label="Topic URL slug" name="slug" error={fields.slug} hint={saved?.slugLocked ? "This published URL is locked." : "Unique within this book or course."}><input id="slug" required disabled={saved?.slugLocked} maxLength={120} value={form.slug} onChange={event => { setSlugEdited(true); setForm(current => ({ ...current, slug: event.target.value })); }} className={adminInputClass} /></AdminField>
            <AdminField label="Editorial order" name="sortOrder" error={fields.sortOrder}><input id="sortOrder" required type="number" min={0} max={2147483646} value={form.sortOrder} onChange={event => setForm(current => ({ ...current, sortOrder: Number(event.target.value) }))} className={adminInputClass} /></AdminField>
            {preview ? <section aria-label="Private notes preview" className="min-w-0 break-words rounded-xl border border-border bg-background p-5 [overflow-wrap:anywhere] [&_pre]:overflow-x-auto"><h2 className="mb-5 text-xl font-semibold">{form.title || "Untitled topic"}</h2>{form.content ? <RecommendationNotes notes={form.content} allowHtml={false} /> : <p className="text-muted-foreground">No notes yet.</p>}</section> : <AdminField label="Topic notes (Markdown)" name="content" error={fields.content}><textarea id="content" rows={20} maxLength={100000} value={form.content} onChange={event => setForm(current => ({ ...current, content: event.target.value }))} className={`${adminInputClass} font-mono leading-6`} /></AdminField>}
            <p className="text-xs text-muted-foreground">{dirty ? "Unsaved changes" : saved ? "All changes saved" : "Not saved yet"}{saved?.isPublished ? " · Saved edits are public when the parent is visible." : ""}</p>
            <div className="flex flex-wrap gap-3"><button disabled={pending} className={adminButtonClass}>{pending ? "Saving…" : saved?.isPublished ? "Save changes" : "Save draft"}</button>{!saved?.isPublished && <button disabled={pending} type="button" onClick={() => void save(true)} className={adminSecondaryClass}>Publish topic</button>}{saved?.isPublished && <button disabled={pending} type="button" onClick={() => void save(false)} className={adminSecondaryClass}>Unpublish</button>}</div>
        </form>
    </div>;
}
