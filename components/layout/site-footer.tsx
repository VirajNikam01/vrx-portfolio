import { ArrowUpRightIcon, CodeXmlIcon, IdCardIcon, MailIcon } from "lucide-react";

const footerLinks = [
  { label: "Email", href: "mailto:hello@example.com", icon: MailIcon },
  { label: "GitHub", href: "https://github.com/", icon: CodeXmlIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: IdCardIcon },
];

export function SiteFooter() {
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
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-background/35 px-3 text-sm text-muted-foreground backdrop-blur transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
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
        <p>© {new Date().getFullYear()} Viraj Nikam. All rights reserved.</p>
        <p></p>
      </div>
    </footer>
  );
}
