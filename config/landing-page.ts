import type { LandingPageContentType } from "@/features/landing-page/types";

import { introductionContent } from "./introduction";
import { workExperiences } from "./work-experience";

export const landingPageContent = {
    featureFlags: {
        showIntroduction: true,
        showWorkExperience: true,
    },
    introduction: introductionContent,
    workExperiences,
} satisfies LandingPageContentType;
