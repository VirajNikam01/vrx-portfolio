import type { LandingPageContentType } from "@/features/landing-page/types";

import { introductionContent } from "./introduction";
import { workExperiences } from "./work-experience";

export const landingPageContent = {
    page: {
        key: "landing-page",
        path: "/",
        title: "Viraj Nikam Portfolio",
    },
    featureFlags: {
        showIntroduction: true,
        showWorkExperience: true,
    },
    sections: [
        {
            key: "introduction",
            componentKey: "Introduction",
            isEnabled: true,
            sortOrder: 10,
            props: {},
            visibilityRules: {
                featureFlagKey: "showIntroduction",
            },
            designOverrides: {},
        },
        {
            key: "workExperience",
            componentKey: "WorkExperience",
            isEnabled: true,
            sortOrder: 20,
            props: {
                heading: "Experience",
                description:
                    "Work that shaped the craft. A concise timeline of practical engineering, UI work, and the technologies used along the way.",
            },
            visibilityRules: {
                featureFlagKey: "showWorkExperience",
            },
            designOverrides: {},
        },
    ],
    introduction: introductionContent,
    workExperiences,
} satisfies LandingPageContentType;
