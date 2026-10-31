"use client";

import { useState } from "react";
import type { BookshelfSummary } from "@/shared/contracts/bookshelf";
import { bookshelfLabels } from "@/shared/contracts/bookshelf";

export function BookshelfCover({ item, compact = false }: { item: BookshelfSummary; compact?: boolean }) {
    const [failedSource, setFailedSource] = useState<string | null>(null);
    const [loadedSource, setLoadedSource] = useState<string | null>(null);
    return (
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex h-full flex-col justify-between bg-gradient-to-br from-primary/10 via-card to-muted p-3 sm:p-4">
                <div className="min-h-0">
                    <span className="mb-4 block h-1 w-7 rounded-full bg-primary" />
                    <p className={compact ? "text-xl font-semibold text-foreground" : "line-clamp-4 break-words text-xs font-semibold leading-snug text-foreground sm:text-sm"}>{compact ? item.title.split(/\s+/).slice(0, 2).map(word => word[0]).join("") : item.title}</p>
                </div>
                {!compact && <div className="shrink-0 space-y-2">
                    <p className="line-clamp-2 text-xs text-muted-foreground">{item.author}</p>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-primary">{bookshelfLabels[item.type]}</p>
                </div>}
            </div>
            {item.coverImageUrl && failedSource !== item.coverImageUrl && (
                // Covers may come from different publishers; preserve their full artwork.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.coverImageUrl} alt="" width={240} height={360} loading="lazy" decoding="async"
                    ref={node => {
                        if (node?.complete) {
                            if (node.naturalWidth > 0) setLoadedSource(item.coverImageUrl);
                            else setFailedSource(item.coverImageUrl);
                        }
                    }}
                    onLoad={() => setLoadedSource(item.coverImageUrl)} onError={() => setFailedSource(item.coverImageUrl)}
                    className={`absolute inset-0 h-full w-full bg-card object-contain ${loadedSource === item.coverImageUrl ? "opacity-100" : "opacity-0"}`} />
            )}
        </div>
    );
}
