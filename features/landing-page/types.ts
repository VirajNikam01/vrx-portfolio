import type { IntroductionContentType } from "@/features/introduction";
import type { ExperienceItemType } from "@/features/work-experience";

export type LandingPageFeatureFlagsType = {
    showIntroduction: boolean;
    showWorkExperience: boolean;
};

export type LandingPageSectionKeyType = "introduction" | "workExperience";

export type LandingPageSectionType = {
    key: LandingPageSectionKeyType;
    componentKey: string;
    isEnabled: boolean;
    sortOrder: number;
    props: Record<string, unknown>;
    visibilityRules: {
        featureFlagKey?: keyof LandingPageFeatureFlagsType;
    };
    designOverrides: Record<string, unknown>;
};

export type LandingPageContentType = {
    page: {
        key: string;
        path: string;
        title: string;
    };
    featureFlags: LandingPageFeatureFlagsType;
    sections: LandingPageSectionType[];
    introduction: IntroductionContentType;
    workExperiences: ExperienceItemType[];
};
