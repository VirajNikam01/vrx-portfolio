"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AdminItem } from "@/shared/contracts/bookshelf-admin";
import { bookshelfLabels, enabledBookshelfTypes } from "@/shared/contracts/bookshelf";
import { filterBookshelf } from "@/lib/bookshelf";
import { adminFetch } from "@/lib/api/admin";
import { BookshelfCover } from "@/app/bookshelf/components/molecules/bookshelf-cover";
import { AdminSaveError } from "@/app/admin/components/molecules/admin-save-error";
import { adminButtonClass, adminInputClass, adminSecondaryClass } from "@/app/admin/components/molecules/admin-field";

export function AdminDashboard({ initialItems }: { initialItems: AdminItem[] }) {
    const [items, setItems] = useState(initialItems);
    const [query, setQuery] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [pending, setPending] = useState<number | null>(null);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        let active = true;
        adminFetch<AdminItem[]>("/bookshelf").then(data => { if (active) setItems(data); }).catch(failure => { if (active) setError(failure instanceof Error ? failure : new Error("Unable to refresh content")); });
        return () => { active = false; };
    }, []);
    const filtered = filterBookshelf(items, null, query).filter(item => (!type || item.type === type) && (!status || (items.find(value => value.id === item.id)?.isVisible ? "published" : "draft") === status));
    async function toggle(item: AdminItem) {
        if (item.isVisible && !confirm(`Hide “${item.title}” from the public bookshelf?`)) return;
        setPending(item.id); setError(null);
        const input = { type: item.type, title: item.title, author: item.author, slug: item.slug, description: item.description,
            category: item.category, coverImageUrl: item.coverImageUrl, externalUrl: item.externalUrl, notes: item.notes, tags: item.tags,
            sortOrder: item.sortOrder, isFeatured: item.isFeatured, isVisible: !item.isVisible, version: item.version };
        try {
            const saved = await adminFetch<AdminItem>(`/bookshelf/${item.id}`, "PATCH", input);
            setItems(current => current.map(value => value.id === saved.id ? saved : value));
        } catch (failure) { setError(failure instanceof Error ? failure : new Error("Unable to save")); }
        finally { setPending(null); }
    }
    return <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-5"><div><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Manage bookshelf</h1><p className="mt-3 text-sm text-muted-foreground">Your collection, notes, and stories. {items.length} items.</p></div><Link href="/admin/bookshelf/new" className={adminButtonClass}>Add item</Link></div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input aria-label="Search content" placeholder="Search title, creator, or tags…" value={query} onChange={event => setQuery(event.target.value)} className={adminInputClass} />
            <select aria-label="Filter media type" value={type} onChange={event => setType(event.target.value)} className={adminInputClass}><option value="">All types</option>{enabledBookshelfTypes.map(value => <option key={value} value={value}>{bookshelfLabels[value]}</option>)}</select>
            <select aria-label="Filter publication status" value={status} onChange={event => setStatus(event.target.value)} className={adminInputClass}><option value="">All statuses</option><option value="draft">Draft / Hidden</option><option value="published">Published</option></select>
        </div>
        <AdminSaveError error={error} />
        {filtered.length === 0 ? <p className="rounded-xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">{items.length ? "No items match these filters." : "Your collection is ready for its first item."}</p> : <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {filtered.map(summary => { const item = items.find(value => value.id === summary.id)!; return <li key={item.id} className="flex flex-wrap items-start gap-4 p-5 sm:p-6">
                <div className="w-14 shrink-0"><BookshelfCover item={item} compact /></div>
                <div className="min-w-0 flex-1 space-y-2"><Link href={`/admin/bookshelf/${item.id}/edit`} className="break-words font-semibold hover:text-primary">{item.title}</Link><p className="text-xs text-muted-foreground">{item.author}</p><div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-muted px-2 py-1">{bookshelfLabels[item.type]}</span><span className={`rounded-full px-2 py-1 ${item.isVisible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{item.isVisible ? "Published" : "Draft / Hidden"}</span>{item.isFeatured && <span className="rounded-full bg-muted px-2 py-1">Featured</span>}<span className="px-2 py-1 text-muted-foreground">Order {item.sortOrder}</span></div></div>
                <div className="flex w-full flex-wrap gap-2 sm:w-auto"><Link href={`/admin/bookshelf/${item.id}/edit`} className={adminSecondaryClass}>Edit</Link><Link href={`/admin/bookshelf/${item.id}/edit?preview=1`} className={adminSecondaryClass}>Preview</Link><button disabled={pending !== null} type="button" onClick={() => void toggle(item)} className={adminSecondaryClass}>{pending === item.id ? "Saving…" : item.isVisible ? "Hide" : "Publish"}</button>{item.isVisible && <Link href={`/bookshelf/${encodeURIComponent(item.slug)}`} target="_blank" className={adminSecondaryClass}>View on bookshelf<span className="sr-only"> (opens in a new tab)</span></Link>}</div>
            </li>; })}
        </ul>}
    </div>;
}
