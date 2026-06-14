import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { Introduction } from "@/features/introduction";
import type {
    LandingPageContentType,
    LandingPageSectionType,
} from "@/features/landing-page";
import { getExperienceDurationLabel } from "@/features/work-experience";
import { WorkExperience } from "@/features/work-experience/components";
import { cn } from "@/lib/utils";

type WorkExperienceSectionProps = {
    heading?: string;
    description?: string;
};

export function MainContent({
    className,
    content,
}: {
    className?: string;
    content: LandingPageContentType;
}) {
    return (
        <div className={cn("relative z-10", className)}>
            <LandingPageSections content={content} />
            <SiteFooter />
        </div>
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
