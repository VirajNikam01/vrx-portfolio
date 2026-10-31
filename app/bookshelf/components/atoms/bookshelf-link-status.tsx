"use client";

import { useLinkStatus } from "next/link";

export function BookshelfLinkStatus() {
    const { pending } = useLinkStatus();
    return <span role="status" className={`block h-4 text-xs text-primary ${pending ? "opacity-100" : "opacity-0"}`}>{pending ? "Opening notes…" : ""}</span>;
}
