"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

import { PrimaryColorPicker } from "@/components/theme/primary-color-picker";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const LOGO_TEXT = "VirajNikam";

const navItems = [
  { label: "Home", href: "#top" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "mailto:hello@example.com" },
];

export function SiteHeader() {
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 120], [0, 8]);
  const headerScale = useTransform(scrollY, [0, 160], [1, 0.985]);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6"
      style={{ y: headerY, scale: headerScale }}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={cn(
          "mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 rounded-lg border px-3",
          "border-border/60 bg-background/55 shadow-[0_12px_48px_rgba(0,0,0,0.08)] backdrop-blur-xl",
          "supports-[backdrop-filter]:bg-background/45 dark:shadow-[0_18px_60px_rgba(0,0,0,0.32)]"
        )}
        initial={{ borderColor: "hsl(0 0% 100% / 0)" }}
        animate={{ borderColor: "var(--border)" }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        <Link
          href="#top"
          className="group/logo inline-flex min-w-0 items-center text-sm font-semibold tracking-tight text-foreground outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Viraj Nikam home"
        >
          <span className="sr-only">Viraj Nikam</span>
          <span aria-hidden className="inline-flex overflow-hidden">
            {LOGO_TEXT.split("").map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                className="inline-block"
                initial={{ y: 18, opacity: 0, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{
                  delay: 0.22 + index * 0.035,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
          <motion.span
            aria-hidden
            className="ml-0.5 inline-flex size-1.5 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.72, duration: 0.45, ease: "easeOut" }}
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-md border border-border/40 bg-background/35 p-1 text-sm text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 rounded-md border border-border/40 bg-background/35 p-1">
          <PrimaryColorPicker />
          <ThemeToggle />
        </div>
      </motion.div>
    </motion.header>
  );
}
