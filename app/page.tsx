"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "@/components/splash/splash-screen";
import { MainContent } from "@/components/pages/landing-page/main-content";
import Stars from "@/components/3d/Stars";
import { SiteHeader } from "@/components/layout/site-header";

export default function Home() {
  const [isSplashDone, setIsSplashDone] = useState(false);

  const handleSplashComplete = () => setIsSplashDone(true);

  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      <Stars />

      {isSplashDone && <SiteHeader />}

      <AnimatePresence mode="wait">
        {!isSplashDone ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <MainContent />
        )}
      </AnimatePresence>
    </main>
  );
}
