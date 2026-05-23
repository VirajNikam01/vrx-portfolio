"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, Target, Transition } from "framer-motion";
import { AppleHelloEnglishEffect } from "@/components/animations/apple-hello-effect";

const SPLASH_EXIT: Target = {
    opacity: 0,
    filter: "blur(24px)",
    scale: 1.05,
};

const SPLASH_EXIT_TRANSITION: Transition = {
    duration: 0.7,
    ease: "easeInOut",
    delay: 0.6,
};

interface SplashScreenProps {
    onComplete: () => void;
}

const SPLASH_FALLBACK_TIMEOUT_MS = 5000;

export function SplashScreen({ onComplete }: SplashScreenProps) {
    const hasCompletedRef = useRef(false);

    const completeOnce = useCallback(() => {
        if (hasCompletedRef.current) {
            return;
        }

        hasCompletedRef.current = true;
        onComplete();
    }, [onComplete]);

    useEffect(() => {
        const timeoutId = window.setTimeout(
            completeOnce,
            SPLASH_FALLBACK_TIMEOUT_MS
        );

        return () => window.clearTimeout(timeoutId);
    }, [completeOnce]);

    return (
        <motion.div
            key="splash"
            className="fixed inset-0 z-20 flex items-center justify-center"
            exit={SPLASH_EXIT}
            transition={SPLASH_EXIT_TRANSITION}
        >
            <AppleHelloEnglishEffect onAnimationComplete={completeOnce} />
        </motion.div>
    );
}
