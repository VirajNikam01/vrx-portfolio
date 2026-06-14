import { SiteFooter } from "@/components/layout/site-footer";
import { Introduction } from "@/features/introduction";
import type { LandingPageContentType } from "@/features/landing-page";
import { getExperienceDurationLabel } from "@/features/work-experience";
import { WorkExperience } from "@/features/work-experience/components";
import { cn } from "@/lib/utils";

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
                    experiences={content.workExperiences}
                />
            )}
        </>
    );
}
