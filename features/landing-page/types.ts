import type { IntroductionContentType } from "@/features/introduction";
import type { ExperienceItemType } from "@/features/work-experience";

export type LandingPageFeatureFlagsType = {
    showIntroduction: boolean;
    showWorkExperience: boolean;
};

export type LandingPageContentType = {
    featureFlags: LandingPageFeatureFlagsType;
    introduction: IntroductionContentType;
    workExperiences: ExperienceItemType[];
};
