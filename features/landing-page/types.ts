import type { IntroductionContentType } from "@/features/introduction";
import type { ExperienceItemType } from "@/features/work-experience";
import type { RecommendationItem } from "@/features/recommendations/types";

export type LandingPageFeatureFlagsType = {
    showIntroduction: boolean;
    showWorkExperience: boolean;
    showBlog: boolean;
    showRecommendations: boolean;
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
    recommendations?: RecommendationItem[];
    meta: MetaType;
};
