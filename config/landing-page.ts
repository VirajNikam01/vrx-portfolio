import type { LandingPageContentType } from "@/features/landing-page/types";

import { introductionContent } from "./introduction";
import { workExperiences } from "./work-experience";
import { defaultSkills } from "./skills";
import { defaultFunProjects } from "./fun-projects";

export const landingPageContent = {
    featureFlags: {
        showIntroduction: true,
        showWorkExperience: true,
        showBlog: true,
        showRecommendations: true,
        showSkills: true,
        showFunProjects: true,
    },
    introduction: introductionContent,
    workExperiences,
    skills: defaultSkills,
    funProjects: defaultFunProjects,
    recommendations: [],
    meta: {
        email: "virajnikam.contact@gmail.com",
        github: {
            url: "https://github.com",
        },
        linkedin: {
            url: "https://www.linkedin.com/in/virajnikam/",
        },
    },
} satisfies LandingPageContentType;
