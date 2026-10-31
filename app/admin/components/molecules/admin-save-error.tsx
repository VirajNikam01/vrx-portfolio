"use client";

import { AdminRequestError } from "@/lib/api/admin";

export function AdminSaveError({ error }: { error: Error | null }) {
    if (!error) return null;
    return <div role="alert" className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
        <p>{error.message}</p>
        {error instanceof AdminRequestError && error.status === 401 && <a href={`/admin/login?returnTo=${encodeURIComponent(location.pathname)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-primary underline">Sign in again in a new tab</a>}
        {error instanceof AdminRequestError && error.status === 409 && !error.fields.slug && <button type="button" className="min-h-11 text-primary underline" onClick={() => { if (confirm("Discard your unsaved edits and load the latest version?")) location.reload(); }}>Reload latest</button>}
    </div>;
}
