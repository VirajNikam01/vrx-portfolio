import type { IntroductionContentType } from "@/features/introduction";
import type { ExperienceItemType } from "@/features/work-experience";

export type LandingPageFeatureFlagsType = {
    showIntroduction: boolean;
    showWorkExperience: boolean;
};

export type MetaType = {
    email: string;
    github: {
        url: string;
    };
    linkedin: {
        url: string;
    };
};

export type LandingPageContentType = {
    featureFlags: LandingPageFeatureFlagsType;
    introduction: IntroductionContentType;
    workExperiences: ExperienceItemType[];
    meta: MetaType;
};
