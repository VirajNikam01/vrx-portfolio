import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { PrimaryColorPicker } from "@/app/components/molecules/theme/primary-color-picker";
import { ThemeToggle } from "@/app/components/molecules/theme/theme-toggle";

export const metadata: Metadata = { title: "Website administration", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";
export default function AdminLayout({ children }: { children: ReactNode }) {
    return <div className="min-h-dvh bg-background text-foreground"><header className="border-b border-border px-4 py-4 sm:px-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3"><Link href="/admin" className="font-semibold tracking-tight">Website <span className="text-primary">admin</span></Link><div className="flex items-center gap-1 sm:gap-3"><Link href="/bookshelf" target="_blank" className="inline-flex min-h-11 items-center rounded-lg px-2 text-xs text-muted-foreground hover:text-primary">Public shelf<span className="sr-only"> (opens in a new tab)</span></Link><PrimaryColorPicker /><ThemeToggle /></div></div></header><main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-12">{children}</main></div>;
}
