import { bookshelfMetadata } from "@/lib/seo/metadata";
import { redirect } from "next/navigation";
import { readBookshelfCatalog } from "@/lib/bookshelf-data";
import { bookshelfCategoryHref, parseBookshelfType } from "@/lib/bookshelf";

export const metadata = bookshelfMetadata;
export const dynamic = "force-dynamic";

export default async function BookshelfPage({ searchParams }: { searchParams: Promise<{ type?: string | string[]; q?: string | string[] }> }) {
    const params = await searchParams;
    const type = parseBookshelfType(typeof params.type === "string" ? params.type : null);
    if (type) {
        const target = bookshelfCategoryHref(await readBookshelfCatalog(), type, typeof params.q === "string" ? params.q : "");
        if (target.startsWith("/bookshelf/")) redirect(target);
    }
    return null;
}
