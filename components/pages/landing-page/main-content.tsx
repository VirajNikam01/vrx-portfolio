import { landingPageAction } from "@/actions/landing-page";
import { SiteFooter } from "@/components/layout/site-footer";
import { Introduction } from "@/features/introduction";
import { useLandingPageContent, type LandingPageContentType } from "@/features/landing-page";
import { ExperienceItemType, getExperienceDurationLabel } from "@/features/work-experience";
import { WorkExperience } from "@/features/work-experience/components";
import { cn } from "@/lib/utils";

export function MainContent() {

    return (
        <div className={cn("relative z-10")}>
            <LandingPageSections />
            <SiteFooter />
        </div>
    );
}

function LandingPageSections() {
    const { data: landingPageContent } = useLandingPageContent();
    const content = landingPageContent.data;
    const allowedVisibleExperiences = content.workExperiences.filter(
        (experience: ExperienceItemType) => experience.isVisible,
    );
    const experienceDurationLabel = getExperienceDurationLabel(
        content.workExperiences,
    );

    return (
        <>
            {content.featureFlags.showIntroduction && (
                <Introduction
                    content={content.introduction}
                    experienceDurationLabel={experienceDurationLabel}
                />
            )}

            {content.featureFlags.showWorkExperience && (
                <WorkExperience
                    experiences={allowedVisibleExperiences}
                />
            )}
        </>
    );
}
