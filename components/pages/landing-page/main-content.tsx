"use client";

import { motion } from "framer-motion";
import type { Target, Transition } from "framer-motion";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { Introduction } from "@/features/introduction";
import { useLandingPageContent } from "@/features/landing-page";
import type {
    LandingPageContentType,
    LandingPageSectionType,
} from "@/features/landing-page";
import { getExperienceDurationLabel } from "@/features/work-experience";
import { WorkExperience } from "@/features/work-experience/components";
import { cn } from "@/lib/utils";

const CONTENT_INITIAL: Target = { opacity: 0, filter: "blur(12px)" };
const CONTENT_ANIMATE: Target = { opacity: 1, filter: "blur(0px)" };
const CONTENT_TRANSITION: Transition = { duration: 0.8, ease: "easeOut" };

type WorkExperienceSectionProps = {
    heading?: string;
    description?: string;
};

export function MainContent({
    className,
    initialContent,
}: {
    className?: string;
    initialContent?: LandingPageContentType;
}) {
    const { data: content } = useLandingPageContent(initialContent);

    if (!content) {
        return null;
    }

    return (
        <AnimatedContent className={className}>
            <LandingPageSections content={content} />
            <SiteFooter />
        </AnimatedContent>
    );
}

function LandingPageSections({ content }: { content: LandingPageContentType }) {
    const introductionSection = getSection(content, "introduction");
    const workExperienceSection = getSection(content, "workExperience");
    const workExperienceProps =
        getWorkExperienceSectionProps(workExperienceSection);
    const experienceDurationLabel = getExperienceDurationLabel(
        content.workExperiences,
    );

    return (
        <>
            <SectionGuard
                section={introductionSection}
                featureFlags={content.featureFlags}
            >
                <Introduction
                    content={content.introduction}
                    experienceDurationLabel={experienceDurationLabel}
                />
            </SectionGuard>

            <SectionGuard
                section={workExperienceSection}
                featureFlags={content.featureFlags}
            >
                <WorkExperience
                    experiences={content.workExperiences}
                    heading={workExperienceProps.heading}
                    description={workExperienceProps.description}
                />
            </SectionGuard>
        </>
    );
}

function AnimatedContent({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            key="content"
            className={cn("relative z-10", className)}
            initial={CONTENT_INITIAL}
            animate={CONTENT_ANIMATE}
            transition={CONTENT_TRANSITION}
        >
            {children}
        </motion.div>
    );
}

function SectionGuard({
    children,
    fallback = null,
    featureFlags,
    section,
}: {
    children: ReactNode;
    fallback?: ReactNode;
    featureFlags: LandingPageContentType["featureFlags"];
    section?: LandingPageSectionType;
}) {
    return canRenderSection(section, featureFlags) ? children : fallback;
}

function canRenderSection(
    section: LandingPageSectionType | undefined,
    featureFlags: LandingPageContentType["featureFlags"],
) {
    if (!section?.isEnabled) {
        return false;
    }

    const featureFlagKey = section.visibilityRules.featureFlagKey;

    return !featureFlagKey || featureFlags[featureFlagKey];
}

function getSection(
    content: LandingPageContentType,
    sectionKey: LandingPageSectionType["key"],
) {
    return content.sections.find((section) => section.key === sectionKey);
}

function getWorkExperienceSectionProps(
    section: LandingPageSectionType | undefined,
) {
    return (section?.props ?? {}) as WorkExperienceSectionProps;
}
