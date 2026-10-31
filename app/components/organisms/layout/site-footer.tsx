"use client";

import { useLandingPageContent } from "@/hooks/landing-page/use-landing-page-content";
import { ArrowUpRightIcon, CodeXmlIcon, IdCardIcon, MailIcon } from "lucide-react";



export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const { data: landingPageContent } = useLandingPageContent();
  const meta = landingPageContent?.data.meta;
  if (!meta) return null;
  const footerLinks = [
    {
      label: "Email",
      href: `mailto:${meta.email}`,
      icon: MailIcon,
    },
    {
      label: "LinkedIn",
      href: meta.linkedin.url,
      icon: IdCardIcon,
    },
    {
      label: "GitHub",
      href: meta.github.url,
      icon: CodeXmlIcon,
    },
  ];


  return (
    <footer className="relative z-10 border-t border-border/60 px-6 py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="flex flex-wrap gap-2 md:justify-end">
          {footerLinks.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.label}
                href={link.href}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-transparent"
              >
                <Icon className="size-4" />
                {link.label}
                <ArrowUpRightIcon className="size-3.5 opacity-60" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-5xl flex-col gap-2 border-t border-border/50 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {currentYear} Viraj Nikam. All rights reserved.</p>
      </div>
    </footer>
  );
}
