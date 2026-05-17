"use client";

import { motion, Target, Transition } from "framer-motion";

const CONTENT_INITIAL: Target = { opacity: 0, filter: "blur(12px)" };
const CONTENT_ANIMATE: Target = { opacity: 1, filter: "blur(0px)" };
const CONTENT_TRANSITION: Transition = { duration: 0.8, ease: "easeOut" };

export function MainContent() {
    return (
        <motion.div
            key="content"
            className="absolute inset-0 flex items-center justify-center"
            initial={CONTENT_INITIAL}
            animate={CONTENT_ANIMATE}
            transition={CONTENT_TRANSITION}
        >
            <div className="max-w-xl w-full space-y-4">
                <p className="text-sm tracking-widest uppercase text-muted-foreground">
                    Software Developer
                </p>
                <h1 className="text-5xl font-medium tracking-tight">
                    I'm Viraj.
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground">
                    I specialize in crafting elegant and efficient web applications —
                    blending strong JavaScript fundamentals with a keen eye for design
                    to create seamless user experiences that are both intuitive and
                    performant.
                </p>
                <div className="flex items-center gap-4 pt-2">
                    <button className="text-sm font-medium underline underline-offset-4 hover:opacity-60 transition-opacity">
                        View my work
                    </button>
                    <span className="text-muted-foreground">·</span>
                    <button className="text-sm font-medium underline underline-offset-4 hover:opacity-60 transition-opacity">
                        Get in touch
                    </button>
                </div>
            </div>
        </motion.div>
    );
}