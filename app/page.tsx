"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme/theme-toogle";
import { SplashScreen } from "@/components/splash/splash-screen";
import { MainContent } from "@/components/splash/main-content";
import Stars from "@/components/3d/Stars";

export default function Home() {
  const [isSplashDone, setIsSplashDone] = useState(false);

  const handleSplashComplete = () => setIsSplashDone(true);

  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      <div className="fixed right-4 top-4 z-50">
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
