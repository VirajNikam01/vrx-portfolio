"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminItemSchema, suggestSlug, type AdminItem, type AdminItemInput, type AdminTopic } from "@/shared/contracts/bookshelf-admin";
import { enabledBookshelfTypes, bookshelfLabels } from "@/shared/contracts/bookshelf";
import { adminFetch, AdminRequestError } from "@/lib/api/admin";
import { safeSourceUrl } from "@/lib/bookshelf";
import { useUnsavedChanges } from "@/hooks/admin/use-unsaved-changes";
import { AdminField, adminInputClass, adminButtonClass, adminSecondaryClass } from "@/app/admin/components/molecules/admin-field";
import { AdminSaveError } from "@/app/admin/components/molecules/admin-save-error";
import { BookshelfCover } from "@/app/bookshelf/components/molecules/bookshelf-cover";
import { BookshelfReader } from "@/app/bookshelf/components/organisms/bookshelf-reader";

function editableItem(item: AdminItem | null, order: number): AdminItemInput {
    return { type: item?.type ?? "book", title: item?.title ?? "", author: item?.author ?? "", slug: item?.slug ?? "",
        description: item?.description ?? "", category: item?.category ?? "other", coverImageUrl: item?.coverImageUrl ?? "",
        externalUrl: item?.externalUrl ?? "", notes: item?.notes ?? "", tags: item?.tags ?? [], sortOrder: item?.sortOrder ?? order,
        isFeatured: item?.isFeatured ?? false, isVisible: item?.isVisible ?? false, ...(item ? { version: item.version } : {}) };
}

export function AdminItemEditor({ initialItem, topics = [], nextOrder = 0, startPreview = false }: { initialItem: AdminItem | null; topics?: AdminTopic[]; nextOrder?: number; startPreview?: boolean }) {
    const router = useRouter();
    const [saved, setSaved] = useState(initialItem);
    const [form, setForm] = useState(() => editableItem(initialItem, nextOrder));
    const [baseline, setBaseline] = useState(() => JSON.stringify(editableItem(initialItem, nextOrder)));
    const [tagText, setTagText] = useState(initialItem?.tags.join(", ") ?? "");
    const [slugEdited, setSlugEdited] = useState(Boolean(initialItem));
    const [preview, setPreview] = useState(startPreview);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [fields, setFields] = useState<Record<string, string[]>>({});
    const [message, setMessage] = useState("");
    const dirty = JSON.stringify(form) !== baseline;
    useUnsavedChanges(dirty);
    const hasChapters = form.type === "book" || form.type === "course";
    function change<K extends keyof AdminItemInput>(key: K, value: AdminItemInput[K]) { setForm(current => ({ ...current, [key]: value })); setMessage(""); }
    function validate(isVisible = form.isVisible) {
        const result = adminItemSchema.safeParse({ ...form, isVisible });
        if (!result.success) {
            const next: Record<string, string[]> = {};
            for (const issue of result.error.issues) (next[String(issue.path[0])] ??= []).push(issue.message);
            setFields(next); setError(new Error("Please check the highlighted fields.")); setPreview(false);
            return null;
        }
        setFields({}); setError(null);
        return result.data;
    }
    async function save(isVisible: boolean) {
        if (saved?.isVisible && !isVisible && !confirm(`Save your changes and hide “${form.title}” from the public bookshelf?`)) return;
        const input = validate(isVisible);
        if (!input) return;
        setPending(true); setMessage("");
        try {
            const item = await adminFetch<AdminItem>(saved ? `/bookshelf/${saved.id}` : "/bookshelf", saved ? "PATCH" : "POST", input);
            const next = editableItem(item, nextOrder);
            setSaved(item); setForm(next); setBaseline(JSON.stringify(next)); setTagText(item.tags.join(", ")); setSlugEdited(true);
            setMessage(item.isVisible ? "Published changes saved." : "Draft saved. This item is private.");
            if (!saved) router.replace(`/admin/bookshelf/${item.id}/edit`);
        } catch (failure) {
            setError(failure instanceof Error ? failure : new Error("Unable to save. Please try again."));
            if (failure instanceof AdminRequestError) setFields(failure.fields);
        } finally { setPending(false); }
    }
    const cover = safeSourceUrl(form.coverImageUrl) ?? (/^\/images\/[\w/.-]+$/.test(form.coverImageUrl) && !form.coverImageUrl.includes("..") ? form.coverImageUrl : null);
    const previewItem = { id: saved?.id ?? 0, slug: form.slug, type: form.type, title: form.title || "Untitled", author: form.author,
        description: form.description, tags: form.tags, coverImageUrl: cover, externalUrl: safeSourceUrl(form.externalUrl), notes: form.notes };
    const inputError = (name: string) => ({ "aria-invalid": Boolean(fields[name]?.length), "aria-describedby": fields[name]?.length ? `${name}-error` : undefined });
    return <div className="space-y-7">
        <Link href="/admin/bookshelf" className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">← All content</Link>
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{saved?.isVisible ? "Published · edits go live when saved" : "Private draft"}</p><h1 className="text-3xl font-semibold">{saved ? "Edit item" : "Add item"}</h1></div><button type="button" className={adminSecondaryClass} onClick={() => { if (preview) setPreview(false); else if (validate()) setPreview(true); }}>{preview ? "Back to editor" : "Preview item"}</button></div>
        <AdminSaveError error={error} />
        {message && <p role="status" className="rounded-lg bg-primary/10 p-4 text-sm text-primary">{message}</p>}
        {preview ? <section aria-label="Private preview" className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 sm:p-8"><p className="mb-8 text-xs uppercase tracking-widest text-primary">Private preview · unsaved content</p><BookshelfReader item={previewItem} topics={saved?.isVisible ? topics.filter(topic => topic.isPublished) : []} /></section> : (
            <form onSubmit={event => { event.preventDefault(); void save(form.isVisible); }} className="grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="min-w-0 space-y-6 rounded-2xl border border-border bg-card p-5 sm:p-7">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <AdminField label="Media type" name="type" error={fields.type} hint={topics.length ? "This item has chapters; keep it as a book or course." : "Only books and courses can be featured or have chapters."}><select id="type" value={form.type} {...inputError("type")} onChange={event => { const type = event.target.value as AdminItemInput["type"]; setForm(current => ({ ...current, type, isFeatured: ["book", "course"].includes(type) && current.isFeatured })); }} className={adminInputClass}>{!enabledBookshelfTypes.some(type => type === form.type) && <option value={form.type} disabled>{bookshelfLabels[form.type]} (existing item)</option>}{enabledBookshelfTypes.map(type => <option key={type} value={type} disabled={topics.length > 0 && !["book", "course"].includes(type)}>{bookshelfLabels[type]}</option>)}</select></AdminField>
                        <AdminField label="Subject" name="category" error={fields.category}><select id="category" value={form.category} onChange={event => change("category", event.target.value as AdminItemInput["category"])} className={adminInputClass}><option value="tech">Tech</option><option value="philosophy">Philosophy</option><option value="other">Other</option></select></AdminField>
                    </div>
                    <AdminField label="Title" name="title" error={fields.title}><input id="title" required maxLength={250} value={form.title} {...inputError("title")} onChange={event => { const title = event.target.value; setForm(current => ({ ...current, title, ...(!slugEdited && !saved ? { slug: suggestSlug(title) } : {}) })); }} className={adminInputClass} /></AdminField>
                    <AdminField label={form.type === "movie" ? "Director / Creator" : "Author / Creator"} name="author" error={fields.author}><input id="author" required maxLength={250} value={form.author} {...inputError("author")} onChange={event => change("author", event.target.value)} className={adminInputClass} /></AdminField>
                    <AdminField label="URL slug" name="slug" error={fields.slug} hint={saved?.slugLocked ? "Locked because this URL has been published." : "Lowercase letters, numbers, and hyphens. Saved titles will not change this URL."}><input id="slug" required maxLength={120} disabled={saved?.slugLocked} value={form.slug} {...inputError("slug")} onChange={event => { setSlugEdited(true); change("slug", event.target.value); }} className={adminInputClass} /></AdminField>
                    <AdminField label="Description" name="description" error={fields.description}><textarea id="description" required maxLength={2000} rows={4} value={form.description} {...inputError("description")} onChange={event => change("description", event.target.value)} className={adminInputClass} /></AdminField>
                    <AdminField label="Cover image URL" name="coverImageUrl" error={fields.coverImageUrl} hint="Optional HTTP(S) URL or an existing /images/ path. Uploads are not required."><input id="coverImageUrl" value={form.coverImageUrl} {...inputError("coverImageUrl")} onChange={event => change("coverImageUrl", event.target.value)} className={adminInputClass} /></AdminField>
                    <AdminField label="Original source URL" name="externalUrl" error={fields.externalUrl}><input id="externalUrl" value={form.externalUrl} {...inputError("externalUrl")} onChange={event => change("externalUrl", event.target.value)} className={adminInputClass} /></AdminField>
                    <AdminField label="Tags" name="tags" error={fields.tags} hint="Separate tags with commas. Up to 20 tags."><input id="tags" value={tagText} {...inputError("tags")} onChange={event => { setTagText(event.target.value); change("tags", event.target.value.split(",").map(tag => tag.trim()).filter(Boolean)); }} className={adminInputClass} /></AdminField>
                    <AdminField label={form.type === "note" ? "Note (Markdown)" : "Personal notes (Markdown)"} name="notes" error={fields.notes} hint={form.type === "note" ? "Write your own standalone piece here. Notes need a body before publishing; a source link is optional." : "Headings, lists, quotes, links, tables, and code blocks are supported. Use Preview item to check the result."}><textarea id="notes" rows={16} maxLength={100000} value={form.notes} {...inputError("notes")} onChange={event => change("notes", event.target.value)} className={`${adminInputClass} font-mono leading-6`} /></AdminField>
                </div>
                <aside className="min-w-0 space-y-6">
                    <div className="max-w-36"><BookshelfCover item={previewItem} /></div>
                    <div className="space-y-5 rounded-xl border border-border bg-card p-5">
                        <AdminField label="Editorial order" name="sortOrder" error={fields.sortOrder}><input id="sortOrder" type="number" min={0} max={2147483646} required value={form.sortOrder} {...inputError("sortOrder")} onChange={event => change("sortOrder", Number(event.target.value))} className={adminInputClass} /></AdminField>
                        <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" disabled={!hasChapters} checked={form.isFeatured} onChange={event => change("isFeatured", event.target.checked)} />Featured book/course</label>
                        <p className="text-xs leading-5 text-muted-foreground">Switching to another media type clears featured status. New items stay private until you choose Publish.</p>
                        <div className="flex flex-col gap-3">
                            <button disabled={pending} type="submit" className={adminButtonClass}>{pending ? "Saving…" : saved?.isVisible ? "Save changes" : "Save draft"}</button>
                            {!saved?.isVisible && <button disabled={pending} type="button" onClick={() => void save(true)} className={adminSecondaryClass}>Publish</button>}
                            {saved?.isVisible && <button disabled={pending} type="button" onClick={() => void save(false)} className={adminSecondaryClass}>Hide</button>}
                        </div>
                        <p className="text-xs text-muted-foreground">{dirty ? "Unsaved changes" : saved ? "All changes saved" : "Not saved yet"}</p>
                    </div>
                </aside>
            </form>
        )}
        {saved && hasChapters && <section className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl font-semibold">Chapter notes</h2><Link href={`/admin/bookshelf/${saved.id}/topics/new`} className={adminSecondaryClass}>Add topic</Link></div>{!saved.isVisible && <p className="text-xs text-muted-foreground">This parent is hidden; its chapters are private even if marked published.</p>}{topics.length ? <ul className="divide-y divide-border">{topics.map(topic => <li key={topic.id}><Link href={`/admin/bookshelf/${saved.id}/topics/${topic.id}/edit`} className="flex min-h-14 flex-wrap items-center justify-between gap-3 py-3 text-sm hover:text-primary"><span>{topic.title}</span><span className="text-xs text-muted-foreground">{topic.isPublished ? "Published" : "Draft"} · Order {topic.sortOrder}</span></Link></li>)}</ul> : <p className="text-sm text-muted-foreground">No chapter notes yet.</p>}</section>}
    </div>;
}
