"use client";

import { motion, Target, Transition } from "framer-motion";
import { Introduction, useIntroductionContent } from "@/features/introduction";
import { useWorkExperiences } from "@/features/work-experience";
import { WorkExperience } from "@/features/work-experience/components";
import { SiteFooter } from "@/components/layout/site-footer";

const CONTENT_INITIAL: Target = { opacity: 0, filter: "blur(12px)" };
const CONTENT_ANIMATE: Target = { opacity: 1, filter: "blur(0px)" };
const CONTENT_TRANSITION: Transition = { duration: 0.8, ease: "easeOut" };

export function MainContent() {
    const { data: introductionContent } = useIntroductionContent();
    const { data: workExperiences } = useWorkExperiences();

    if (!introductionContent || !workExperiences) {
        return null;
    }

    return (
        <motion.div
            key="content"
            className="relative z-10"
            initial={CONTENT_INITIAL}
            animate={CONTENT_ANIMATE}
            transition={CONTENT_TRANSITION}
        >
            <Introduction content={introductionContent} />
            <WorkExperience experiences={workExperiences} />
            <SiteFooter />
        </motion.div>
    );
}
