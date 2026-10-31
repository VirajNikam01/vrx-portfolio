"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { PrimaryColorPicker } from "@/app/components/molecules/theme/primary-color-picker";
import { ThemeToggle } from "@/app/components/molecules/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { NavigationLink } from "@/app/components/molecules/navigation-link";

const LOGO_TEXT = "VRJ";

function useScrollState(threshold = 4) {
  const [scrollState, setScrollState] = useState({
    hasScrolled: false,
    progress: 0,
  });

  useEffect(() => {
    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      setScrollState({
        hasScrolled: window.scrollY > threshold,
        progress,
      });
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, [threshold]);

  return scrollState;
}

export function SiteHeader() {
  const { hasScrolled, progress } = useScrollState();

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40 px-4 pt-6 sm:px-8">
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 h-1 origin-left bg-primary"
        style={{ transform: `scaleX(${progress})` }}
      />

      <div className="pointer-events-none fixed inset-x-4 top-6 sm:inset-x-8">
        <div
          className={cn(
            "mx-auto flex h-16 w-full max-w-7xl items-center rounded-2xl border px-5 transition-colors duration-300 sm:h-20 sm:px-8",
            hasScrolled
              ? "border-border/60 w-fit bg-background/95 shadow-[0_18px_60px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-zinc-900/95 dark:shadow-[0_18px_80px_rgba(0,0,0,0.38)]"
              : "border-transparent bg-transparent"
          )}
        >
          <Link
            href="/"
            className="group/logo pointer-events-auto inline-flex min-w-0 items-center text-xl font-bold tracking-tight text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-2xl"
            aria-label="Viraj Nikam home"
          >
            <span className="sr-only">Viraj Nikam</span>
            <span aria-hidden className="inline-flex overflow-hidden italic">
              {LOGO_TEXT} <span className="text-3xl italic font-normal">X</span>
            </span>
            <span
              aria-hidden
              className="ml-1.5 mt-1.5 inline-flex size-1.5 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]"
            />
          </Link>
        </div>
      </div>

      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-end px-5 sm:h-20 sm:px-8">
        <div className="pointer-events-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <NavigationLink href="/bookshelf" activePaths={["/recommendations"]} className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Bookshelf</NavigationLink>
          <PrimaryColorPicker />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
