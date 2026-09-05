import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { RecommendationsPageClient } from "./recommendations-page-client";

import { getSiteUrl, serializeJsonLd } from "@/config/seo";

export const metadata: Metadata = {
    title: "Recommendations & Book Notes — Viraj Nikam",
    description:
        "Hand-picked recommendations and detailed chapter-by-chapter notes on engineering, software architecture, philosophy, and productivity books & courses.",
    keywords: [
        "Software Engineering Books",
        "Book Notes",
        "React Hook Form Notes",
        "Designing Data Intensive Applications Notes",
        "Tech Recommendations",
        "Viraj Nikam Recommendations",
    ],
    alternates: {
        canonical: getSiteUrl("/recommendations"),
    },
    openGraph: {
        title: "Recommendations & Book Notes — Viraj Nikam",
        description:
            "Hand-picked recommendations and detailed chapter-by-chapter notes on engineering, software architecture, philosophy, and productivity.",
        url: getSiteUrl("/recommendations"),
        siteName: "Viraj Nikam",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Recommendations & Book Notes — Viraj Nikam",
        description:
            "Hand-picked recommendations and detailed chapter-by-chapter notes on engineering, software architecture, and philosophy.",
    },
};

const recommendationsListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Recommendations & Book Notes — Viraj Nikam",
    description:
        "Hand-picked recommendations and detailed chapter-by-chapter notes on engineering, software architecture, philosophy, and productivity.",
    url: getSiteUrl("/recommendations"),
    author: {
        "@type": "Person",
        name: "Viraj Nikam",
    },
};


export default function RecommendationsPage() {
    return (
        <main className="relative min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_38%),linear-gradient(to_bottom,_rgba(255,255,255,0.96),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(to_bottom,_rgba(9,9,11,0.96),_rgba(9,9,11,1))]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serializeJsonLd(recommendationsListJsonLd),
                }}
            />
            <SiteHeader />
            <div className="relative z-10">
                <section className="px-6 py-28">
                    <div className="mx-auto w-full max-w-5xl">
                        <div className="mb-12 space-y-3">
                            <h1 className="text-4xl font-bold tracking-tight text-primary">
                                Recommendations
                            </h1>
                            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                                Books I've found genuinely useful.
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
