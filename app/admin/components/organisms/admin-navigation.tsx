"use client";

import { NavigationLink } from "@/app/components/molecules/navigation-link";
import { usePathname } from "next/navigation";
import { adminModules } from "@/config/admin-modules";
import { cn } from "@/lib/utils";

export function AdminNavigation() {
    const pathname = usePathname();
    const entries = [{ href: "/admin", title: "Overview" }, ...adminModules];
    return <nav aria-label="Admin modules" className="mb-8 flex flex-wrap gap-2 border-b border-border pb-5">
        {entries.map(entry => {
            const active = entry.href === "/admin" ? pathname === "/admin" : pathname === entry.href || pathname.startsWith(`${entry.href}/`);
            return <NavigationLink key={entry.href} href={entry.href} active={active} variant="filled" className={cn("inline-flex min-h-11 items-center rounded-lg px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring", !active && "text-muted-foreground hover:bg-muted hover:text-foreground")}>{entry.title}</NavigationLink>;
        })}
    </nav>;
}
