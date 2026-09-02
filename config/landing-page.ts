import type { LandingPageContentType } from "@/features/landing-page/types";

import { introductionContent } from "./introduction";
import { workExperiences } from "./work-experience";

export const landingPageContent = {
    featureFlags: {
        showIntroduction: true,
        showWorkExperience: true,
        showBlog: true,
        showRecommendations: true,
    },
    introduction: introductionContent,
    workExperiences,
    recommendations: [],
    meta: {
        email: "virajnikam.contact@gmail.com",
        github: {
            url: "https://github.com"
        },
        linkedin: {
            url: "https://www.linkedin.com/in/virajnikam"
        }
    }
} satisfies LandingPageContentType;
