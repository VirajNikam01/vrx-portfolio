"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Stars from "@/components/3d/Stars";
import { SiteHeader } from "@/components/layout/site-header";
import { SplashScreen } from "@/components/splash/splash-screen";
import { MainContent } from "@/components/pages/landing-page/main-content";
import type { LandingPageContentType } from "@/features/landing-page";

export function HomePageClient({
    initialContent,
}: {
    initialContent: LandingPageContentType;
}) {
    const [isSplashDone, setIsSplashDone] = useState(false);

    const handleSplashComplete = () => setIsSplashDone(true);

    return (
        <main className="relative min-h-dvh overflow-x-hidden">
            <Stars />
            {isSplashDone && <SiteHeader />}

            <MainContent initialContent={initialContent} />

            <AnimatePresence mode="wait">
                {!isSplashDone && (
                    <SplashScreen onComplete={handleSplashComplete} />
                )}
            </AnimatePresence>
        </main>
    );
}
