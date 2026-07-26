import { SiteFooter } from "@/components/layout/site-footer";
import { BlogSection } from "@/features/blog/components/blog-section";
import { ContactSection } from "@/features/contact";
import { Introduction } from "@/features/introduction";
import { useLandingPageContent, type LandingPageContentType } from "@/features/landing-page";
import { ExperienceItemType, getExperienceDurationLabel } from "@/features/work-experience";
import { WorkExperience } from "@/features/work-experience/components";
import { cn } from "@/lib/utils";

export function MainContent() {
    const { data: landingPageContent } = useLandingPageContent();
    const content =
        landingPageContent && "data" in landingPageContent
            ? landingPageContent.data
            : landingPageContent;

    if (!content) {
        return null;
    }

    return (
        <div className={cn("relative z-10")}>
            <LandingPageSections content={content} />
            <SiteFooter />
        </div>
    );
}

function LandingPageSections({
    content,
}: {
    content: LandingPageContentType;
}) {
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
            {content.featureFlags.showBlog && (
                <BlogSection />
            )}
            {content.featureFlags.showWorkExperience && (
                <WorkExperience
                    experiences={allowedVisibleExperiences}
                />
            )}
            <ContactSection />
        </>
    );
}
