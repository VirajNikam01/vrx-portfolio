"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

type NotesCodeBlockProps = {
    language: string;
    code: string;
    children: React.ReactNode; // pre-highlighted children from rehype-highlight
};

export function NotesCodeBlock({ language, code, children }: NotesCodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard not available (e.g. non-secure context) — silent fail
        }
    };

    const lang = language || "plaintext";

    return (
        <div className="my-4 overflow-hidden rounded-xl border border-border/60">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/60 px-4 py-2">
                <span className="font-mono text-xs text-muted-foreground">{lang}</span>
                <button
                    onClick={handleCopy}
                    aria-label={copied ? "Copied!" : "Copy code"}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    {copied ? (
                        <>
                            <CheckIcon className="size-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Copied!</span>
                        </>
                    ) : (
                        <>
                            <CopyIcon className="size-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code body */}
            <div className="overflow-x-auto text-sm">
                {children}
            </div>
        </div>
    );
}
