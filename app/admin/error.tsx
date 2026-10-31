"use client";

import { adminButtonClass } from "@/app/admin/components/molecules/admin-field";
export default function AdminErrorPage({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
    return <div role="alert" className="mx-auto max-w-xl space-y-5 rounded-xl border border-border bg-card p-8"><h1 className="text-2xl font-semibold">Unable to load this page</h1><p className="text-sm text-muted-foreground">Please try again in a moment. No content has been changed.</p><button className={adminButtonClass} onClick={unstable_retry}>Try again</button></div>;
}
