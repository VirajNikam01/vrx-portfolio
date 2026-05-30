import { Introduction } from "@/features/introduction";
import type { LandingPageContentType } from "@/features/landing-page";
import { WorkExperience } from "@/features/work-experience/components";
import type React from "react";

type LandingPageSectionRendererProps = {
    content: LandingPageContentType;
    experienceDurationLabel: string;
    props: Record<string, unknown>;
};

type LandingPageSectionRenderer = (
    props: LandingPageSectionRendererProps,
) => React.ReactNode;

type WorkExperienceSectionProps = {
    heading?: string;
    description?: string;
};

export const landingPageSectionRegistry: Record<
    string,
    LandingPageSectionRenderer
> = {
    Introduction: ({ content, experienceDurationLabel }) => (
        <Introduction
            content={content.introduction}
            experienceDurationLabel={experienceDurationLabel}
        />
    ),
    WorkExperience: ({ content, props }) => {
        const sectionProps = props as WorkExperienceSectionProps;

        return (
            <WorkExperience
                experiences={content.workExperiences}
                heading={sectionProps.heading}
                description={sectionProps.description}
            />
        );
    },
};

export function getLandingPageSectionRenderer(componentKey: string) {
    return landingPageSectionRegistry[componentKey];
}
