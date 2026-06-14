"use client";

import dynamic from "next/dynamic";

import { SiteHeader } from "@/components/layout/site-header";
import { MainContent } from "@/components/pages/landing-page/main-content";
import type { LandingPageContentType } from "@/features/landing-page";

const StarsBackground = dynamic(
    () =>
        import("@/components/3d/Stars").then(
            (module) => module.default,
        ),
    {
        ssr: false,
        loading: () => null,
    },
);

export function HomePageClient({
    content,
}: {
    content: LandingPageContentType;
}) {

    return (
        <main className="relative min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_38%),linear-gradient(to_bottom,_rgba(255,255,255,0.96),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(to_bottom,_rgba(9,9,11,0.96),_rgba(9,9,11,1))]">
            <StarsBackground />
            <SiteHeader />
            <MainContent content={content} />
        </main>
    );
}
