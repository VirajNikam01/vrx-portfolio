import type { ReactNode } from "react";
import { readBookshelfCatalog } from "@/lib/bookshelf-data";
import { SiteHeader } from "@/app/components/organisms/layout/site-header";
import { SiteFooter } from "@/app/components/organisms/layout/site-footer";
import { BookshelfBrowser } from "@/app/bookshelf/components/organisms/bookshelf-browser";
import { BookshelfFailure } from "@/app/bookshelf/components/organisms/bookshelf-failure";

export default async function BookshelfLayout({ children }: { children: ReactNode }) {
    let catalog;
    try {
        catalog = await readBookshelfCatalog();
    } catch {
        console.error("Failed to load the bookshelf catalog");
    }
    return (
        <main className="min-h-dvh bg-background text-foreground">
            <SiteHeader />
            <div className="mx-auto min-h-[75vh] w-full max-w-[1440px] px-4 pb-20 pt-36 sm:px-8 sm:pt-40">
                {catalog ? <BookshelfBrowser items={catalog}>{children}</BookshelfBrowser> : <BookshelfFailure />}
            </div>
            <SiteFooter />
        </main>
    );
}
