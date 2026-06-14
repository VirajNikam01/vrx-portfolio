"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Stars from "@/components/3d/Stars";
import { SiteHeader } from "@/components/layout/site-header";
import { SplashScreen } from "@/components/splash/splash-screen";
import { MainContent } from "@/components/pages/landing-page/main-content";
import type { LandingPageContentType } from "@/features/landing-page";

export function HomePageClient({
    content,
}: {
    content: LandingPageContentType;
}) {
    const [isSplashDone, setIsSplashDone] = useState(true);

    const handleSplashComplete = () => setIsSplashDone(true);

    return (
        <main className="relative min-h-dvh overflow-x-hidden">
            <Stars />
            {isSplashDone && <SiteHeader />}

            <MainContent content={content} />

            <AnimatePresence mode="wait">
                {!isSplashDone && (
                    <SplashScreen onComplete={handleSplashComplete} />
                )}
            </AnimatePresence>
        </main>
    );
}
