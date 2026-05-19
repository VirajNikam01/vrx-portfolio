"use client";

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

export function SplashScreen({ onComplete }: SplashScreenProps) {
    return (
        <motion.div
            key="splash"
            className="fixed inset-0 z-20 flex items-center justify-center"
            exit={SPLASH_EXIT}
            transition={SPLASH_EXIT_TRANSITION}
        >
            <AppleHelloEnglishEffect onAnimationComplete={onComplete} />
        </motion.div>
    );
}
