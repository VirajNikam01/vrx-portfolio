import type { IntroductionContentType } from "@/shared/contracts/introduction";
import type { ExperienceItemType } from "@/shared/contracts/work-experience";
import type { RecommendationItem } from "@/shared/contracts/recommendations";
import type { SkillItemType } from "@/shared/contracts/skills";
import type { FunProjectItemType } from "@/shared/contracts/fun-projects";

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
