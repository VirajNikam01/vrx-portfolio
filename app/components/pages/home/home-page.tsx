"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

import { SiteHeader } from "@/app/components/organisms/layout/site-header";
import { HomeContent } from "@/app/components/pages/home/home-content";
import { useVisitorMutation } from "@/hooks/visitors/use-visitor-mutation";
import { collectClientFingerprint } from "@/lib/fingerprint";

const StarsBackground = dynamic(
    () =>
        import("@/app/components/organisms/stars-background").then(
            (module) => module.StarsBackground,
        ),
    {
        ssr: false,
        loading: () => null,
    },
);

export function HomePage() {
    const visitorMutation = useVisitorMutation();
    useEffect(() => {
        const visitorData = collectClientFingerprint();
        visitorMutation.mutate(visitorData);
    }, []);

    return (
        <main className="relative min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_38%),linear-gradient(to_bottom,_rgba(255,255,255,0.96),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(to_bottom,_rgba(9,9,11,0.96),_rgba(9,9,11,1))]">
            <StarsBackground />
            <SiteHeader />
            <Suspense fallback={<HomeContentFallback />}>
                <HomeContent />
            </Suspense>
        </main>
    );
}

function HomeContentFallback() {
    return <div className="relative z-10 min-h-[60vh]" aria-hidden />;
}
