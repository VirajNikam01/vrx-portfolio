"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type NavigationLinkProps = Omit<ComponentProps<typeof Link>, "href" | "aria-current"> & {
    href: string;
    active?: boolean;
    exact?: boolean;
    activePaths?: readonly string[];
    variant?: "text" | "filled";
};

export function NavigationLink({ href, active, exact = false, activePaths = [], variant = "text", className, children, ...props }: NavigationLinkProps) {
    const pathname = usePathname();
    const current = active ?? [href.split(/[?#]/)[0], ...activePaths].some(path =>
        pathname === path || (!exact && path !== "/" && pathname?.startsWith(`${path}/`))
    );

    return <Link {...props} href={href} aria-current={current ? "page" : undefined}
        className={cn("relative", className, current && "font-bold text-primary", current && variant === "filled" && "bg-primary/10")}>
        {current && variant === "text" && <span aria-hidden="true" data-active-indicator className="pointer-events-none absolute top-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" />}
        {children}
    </Link>;
}
