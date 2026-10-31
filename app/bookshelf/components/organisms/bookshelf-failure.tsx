"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function BookshelfFailure({ retry }: { retry?: () => void }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    return (
        <div role="alert" className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
            <h2 className="text-xl font-semibold">The shelf is temporarily unavailable</h2>
            <p className="mt-3 text-sm text-muted-foreground">Please try again in a moment.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <button type="button" disabled={pending} onClick={() => startTransition(() => retry ? retry() : router.refresh())} className="min-h-11 rounded-lg bg-primary px-4 text-sm text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60">{pending ? "Trying again…" : "Try again"}</button>
                <Link href="/bookshelf" className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">Back to bookshelf</Link>
            </div>
        </div>
    );
}
