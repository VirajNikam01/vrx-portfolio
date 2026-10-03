import type { IntroductionContentType } from "@/features/introduction";
import type { ExperienceItemType } from "@/features/work-experience";
import type { RecommendationItem } from "@/features/recommendations/types";
import type { SkillItemType } from "@/features/skills";
import type { FunProjectItemType } from "@/features/fun-projects";

export type LandingPageFeatureFlagsType = {
    showIntroduction: boolean;
    showWorkExperience: boolean;
    showBlog: boolean;
    showRecommendations: boolean;
    showSkills: boolean;
    showFunProjects: boolean;
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
    skills?: SkillItemType[];
    funProjects?: FunProjectItemType[];
    recommendations?: RecommendationItem[];
    meta: MetaType;
};
