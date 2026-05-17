"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme/theme-toogle";
import { SplashScreen } from "@/components/splash/splash-screen";
import { MainContent } from "@/components/splash/main-content";

export default function Home() {
  const [isSplashDone, setIsSplashDone] = useState(false);

  const handleSplashComplete = () => setIsSplashDone(true);

  return (
    <main className="relative h-dvh overflow-hidden">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <AnimatePresence>
        {!isSplashDone && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSplashDone && <MainContent />}
      </AnimatePresence>
    </main>
  );
}