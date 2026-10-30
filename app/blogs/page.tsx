import { blogsMetadata } from "@/lib/seo/metadata";
import { SiteHeader } from "@/app/components/organisms/site-header";
import { SiteFooter } from "@/app/components/organisms/site-footer";
import { BlogsPageClient } from "@/app/blogs/blogs-page-client";

export const metadata = blogsMetadata;

export default function BlogsPage() {
    return (
        <main className="relative min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_38%),linear-gradient(to_bottom,_rgba(255,255,255,0.96),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(to_bottom,_rgba(9,9,11,0.96),_rgba(9,9,11,1))]">
            <SiteHeader />
            <div className="relative z-10 py-16">
                <BlogsPageClient />
                <SiteFooter />
            </div>
        </main>
    );
}
