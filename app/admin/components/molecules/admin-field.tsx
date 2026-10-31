import type { ReactNode } from "react";

export const adminInputClass = "min-h-11 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:bg-muted disabled:text-muted-foreground";
export const adminButtonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";
export const adminSecondaryClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export function AdminField({ label, name, error, hint, children }: { label: string; name: string; error?: string[]; hint?: string; children: ReactNode }) {
    return <div className="min-w-0 space-y-2">
        <label htmlFor={name} className="block text-sm font-medium">{label}</label>
        {children}
        {hint && <p className="text-xs leading-5 text-muted-foreground">{hint}</p>}
        {error?.length ? <p id={`${name}-error`} className="text-xs text-destructive">{error.join(". ")}</p> : null}
    </div>;
}
