import { SiteHeader } from "@/app/components/organisms/site-header";
import { SiteFooter } from "@/app/components/organisms/site-footer";
import { RecommendationsPageClient } from "@/app/recommendations/recommendations-page-client";

import { JsonLd } from "@/app/components/atoms/json-ld";
import { recommendationsMetadata } from "@/lib/seo/metadata";
import { getRecommendationsJsonLd } from "@/lib/seo/structured-data";

export const metadata = recommendationsMetadata;

export default function RecommendationsPage() {
    const structuredData = getRecommendationsJsonLd();
    return (
        <main className="relative min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_38%),linear-gradient(to_bottom,_rgba(255,255,255,0.96),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(to_bottom,_rgba(9,9,11,0.96),_rgba(9,9,11,1))]">
            <JsonLd data={structuredData} />
            <SiteHeader />
            <div className="relative z-10">
                <section className="px-6 py-28">
                    <div className="mx-auto w-full max-w-5xl">
                        <div className="mb-12 space-y-3">
                            <h1 className="text-4xl font-bold tracking-tight text-primary">
                                Recommendations
                            </h1>
                            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                                Books I&apos;ve found genuinely useful.
                            </p>
                        </div>
                        <RecommendationsPageClient />
                    </div>
                </section>
                <SiteFooter />
            </div>
        </main>
    );
}
