"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { PrimaryColorPicker } from "@/components/theme/primary-color-picker";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const LOGO_TEXT = "Viraj Nikam";

function useScrollState(threshold = 4) {
  const [scrollState, setScrollState] = useState({
    activeSection: "top",
    hasScrolled: false,
    progress: 0,
  });

  useEffect(() => {
    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      setScrollState({
        activeSection: getActiveSection(),
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

function getActiveSection() {
  const experienceSection = document.getElementById("experience");

  if (!experienceSection) {
    return "top";
  }

  return window.scrollY >= experienceSection.offsetTop - 160
    ? "experience"
    : "top";
}

function getNavItemId(href: string) {
  return href.startsWith("#") ? href.slice(1) : href;
}

export function SiteHeader() {
  const { activeSection, hasScrolled, progress } = useScrollState();

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-6 sm:px-8">
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 h-1 origin-left bg-primary"
        style={{ transform: `scaleX(${progress})` }}
      />

      <div
        className={cn(
          "mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 rounded-2xl border px-5 transition-all duration-300 sm:h-20 sm:px-8",
          hasScrolled
            ? "border-border/60 bg-background/65 shadow-[0_18px_60px_rgba(0,0,0,0.12)] backdrop-blur-2xl supports-[backdrop-filter]:bg-background/55 dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-[0_18px_80px_rgba(0,0,0,0.38)]"
            : "border-transparent bg-transparent"
        )}
      >
        <Link
          href="#top"
          className="group/logo inline-flex min-w-0 items-center text-xl font-bold tracking-tight text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-2xl"
          aria-label="Viraj Nikam home"
        >
          <span className="sr-only">Viraj Nikam</span>
          <h1 aria-hidden className="inline-flex overflow-hidden">
            {LOGO_TEXT}
          </h1>
          <span
            aria-hidden
            className="ml-1 mt-1.5 inline-flex size-1.5 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]"
          />
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <PrimaryColorPicker />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
