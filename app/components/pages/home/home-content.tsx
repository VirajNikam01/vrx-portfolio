"use client";

import { SiteFooter } from "@/app/components/organisms/layout/site-footer";
import { BlogSection } from "@/app/blogs/components/organisms/blog-section";
import { ContactSection } from "@/app/components/organisms/contact-section";
import { Introduction } from "@/app/components/organisms/introduction/introduction";
import { useLandingPageContent } from "@/hooks/landing-page/use-landing-page-content";
import type { LandingPageContentType } from "@/shared/contracts/landing-page";
import { SkillsSection } from "@/app/components/organisms/skills-section";
import { FunProjectsSection } from "@/app/components/organisms/fun-projects-section";
import { RecommendationsPreview } from "@/app/recommendations/components/organisms/recommendations-preview";
import { ExperienceItemType } from "@/shared/contracts/work-experience";
import { getExperienceDurationLabel } from "@/lib/experience-duration";
import { WorkExperience } from "@/app/components/organisms/work-experience";
import { cn } from "@/lib/utils";

export function HomeContent() {
    const { data: landingPageContent, isPending, isError, refetch } = useLandingPageContent();
    const content = landingPageContent?.data;

    if (isPending) {
        return <p role="status" className="relative z-10 px-6 py-36 text-center text-muted-foreground">Loading content…</p>;
    }

    if (isError && !content) {
        return (
            <div role="alert" className="relative z-10 space-y-4 px-6 py-36 text-center">
                <p className="text-muted-foreground">Content is temporarily unavailable. Please try again.</p>
                <button type="button" onClick={() => void refetch()} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    Try again
                </button>
            </div>
        );
    }

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
                <BlogSection limit={4} showMoreHref="/blogs" />
            )}
            {content.featureFlags.showSkills && (
                <SkillsSection skills={content.skills} />
            )}
            {content.featureFlags.showWorkExperience && (
                <WorkExperience
                    experiences={allowedVisibleExperiences}
                />
            )}
            {content.featureFlags.showFunProjects && (
                <FunProjectsSection projects={content.funProjects} />
            )}
            {content.featureFlags.showRecommendations && (
                <RecommendationsPreview items={content.recommendations} />
            )}
            <ContactSection />
        </>
    );
}
