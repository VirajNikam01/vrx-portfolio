"use client";

import { motion, Target, Transition } from "framer-motion";
import { Introduction } from "@/components/pages/landing-page/sections/introduction";
import { workExperiences as fallbackWorkExperiences } from "@/config/work-experience";
import { useWorkExperiences } from "@/features/work-experience";
import { WorkExperience } from "@/features/work-experience/components";

const CONTENT_INITIAL: Target = { opacity: 0, filter: "blur(12px)" };
const CONTENT_ANIMATE: Target = { opacity: 1, filter: "blur(0px)" };
const CONTENT_TRANSITION: Transition = { duration: 0.8, ease: "easeOut" };

export function MainContent() {
    const { data: workExperiences = fallbackWorkExperiences } = useWorkExperiences();

    return (
        <motion.div
            key="content"
            className="relative z-10"
            initial={CONTENT_INITIAL}
            animate={CONTENT_ANIMATE}
            transition={CONTENT_TRANSITION}
        >
            <Introduction />
            <WorkExperience experiences={workExperiences} />
        </motion.div>
    );
}
