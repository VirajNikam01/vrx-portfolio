"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { PrimaryColorPicker } from "@/components/theme/primary-color-picker";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const LOGO_TEXT = "VirajNikam";

const navItems = [
  { label: "Home", href: "#top" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "mailto:hello@example.com" },
];

function useHasScrolled(threshold = 4) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      setHasScrolled(window.scrollY > threshold);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, [threshold]);

  return hasScrolled;
}

export function SiteHeader() {
  const hasScrolled = useHasScrolled();

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6">
      <div
        className={cn(
          "mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 rounded-lg border px-3",
          hasScrolled
            ? "border-border/60 bg-background/55 shadow-[0_12px_48px_rgba(0,0,0,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/45 dark:shadow-[0_18px_60px_rgba(0,0,0,0.32)]"
            : "border-transparent bg-transparent"
        )}
      >
        <Link
          href="#top"
          className="group/logo inline-flex min-w-0 items-center text-sm font-semibold tracking-tight text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Viraj Nikam home"
        >
          <span className="sr-only">Viraj Nikam</span>
          <span aria-hidden className="inline-flex overflow-hidden">
            {LOGO_TEXT}
          </span>
          <span
            aria-hidden
            className="ml-0.5 inline-flex size-1.5 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]"
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-md border border-border/40 bg-background/35 p-1 text-sm text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 hover:bg-muted/70 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 rounded-md border border-border/40 bg-background/35 p-1">
          <PrimaryColorPicker />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
