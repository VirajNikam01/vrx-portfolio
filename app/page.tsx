"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { PrimaryColorPicker } from "@/components/theme/primary-color-picker";
import { SplashScreen } from "@/components/splash/splash-screen";
import { MainContent } from "@/components/pages/landing-page/main-content";
import Stars from "@/components/3d/Stars";

export default function Home() {
  const [isSplashDone, setIsSplashDone] = useState(false);

  const handleSplashComplete = () => setIsSplashDone(true);

  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      <div className="fixed right-4 top-4 z-50 flex items-center gap-1 rounded-lg border border-border/60 bg-background/70 p-1 shadow-sm backdrop-blur">
        <PrimaryColorPicker />
        <ThemeToggle />
      </div>
      <Stars />


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
