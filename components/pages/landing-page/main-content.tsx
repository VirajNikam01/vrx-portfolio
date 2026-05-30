"use client";

import { motion, Target, Transition } from "framer-motion";
import { Fragment } from "react";
import { useLandingPageContent } from "@/features/landing-page";
import { getExperienceDurationLabel } from "@/features/work-experience";
import { SiteFooter } from "@/components/layout/site-footer";
import type { LandingPageSectionType } from "@/features/landing-page";
import { getLandingPageSectionRenderer } from "./section-registry";

const CONTENT_INITIAL: Target = { opacity: 0, filter: "blur(12px)" };
const CONTENT_ANIMATE: Target = { opacity: 1, filter: "blur(0px)" };
const CONTENT_TRANSITION: Transition = { duration: 0.8, ease: "easeOut" };

export function MainContent() {
    const { data: landingPageContent } = useLandingPageContent();

    if (!landingPageContent) {
        return null;
    }

    const { featureFlags, sections, workExperiences } = landingPageContent;
    const experienceDurationLabel = getExperienceDurationLabel(workExperiences);
    const enabledSections = sections
        .filter((section) => isSectionEnabled(section, featureFlags))
        .sort((firstSection, secondSection) => {
            return firstSection.sortOrder - secondSection.sortOrder;
        });

    return (
        <motion.div
            key="content"
            className="relative z-10"
            initial={CONTENT_INITIAL}
            animate={CONTENT_ANIMATE}
            transition={CONTENT_TRANSITION}
        >
            {enabledSections.map((section) => {
                const renderSection = getLandingPageSectionRenderer(
                    section.componentKey,
                );

                return renderSection ? (
                    <Fragment key={section.key}>
                        {renderSection({
                            content: landingPageContent,
                            experienceDurationLabel,
                            props: section.props,
                        })}
                    </Fragment>
                ) : null;
            })}
            <SiteFooter />
        </motion.div>
    );
}

function isSectionEnabled(
    section: LandingPageSectionType,
    featureFlags: Record<string, boolean>,
) {
    const featureFlagKey = section.visibilityRules.featureFlagKey;

    return section.isEnabled && (!featureFlagKey || featureFlags[featureFlagKey]);
}
