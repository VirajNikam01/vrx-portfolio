import { useQuery } from "@tanstack/react-query";

import { getLandingPageContent } from "./api";
import type { LandingPageContentType } from "./types";

export const landingPageContentQueryKey = ["landing-page-content"] as const;

const landingPagePlaceholderContent = {
    page: {
        key: "landing-page",
        path: "/",
        title: "Portfolio",
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
                    "A snapshot of recent work, responsibilities, and the technologies used across product delivery.",
            },
            visibilityRules: {
                featureFlagKey: "showWorkExperience",
            },
            designOverrides: {},
        },
    ],
    introduction: {
        eyebrow: "Software Developer",
        headline: "Building polished digital products.",
        intro:
            "A frontend-focused developer crafting responsive interfaces, thoughtful interactions, and dependable web experiences.",
        image: {
            src: "/images/intro/vrx-image.jpg",
            alt: "Portfolio placeholder image",
        },
        statement: [
            { text: "A passionate " },
            { text: "Software Engineer", emphasis: "solid" },
            { text: " with " },
            { text: "", emphasis: "duration" },
            { text: " of experience building " },
            {
                text: "clean, reliable & scalable applications",
                emphasis: "accent",
            },
            { text: " using React, Next.js, TypeScript, and Tailwind CSS." },
        ],
        actions: {
            connect: {
                label: "Contact Me",
                href: "mailto:hello@example.com",
            },
            resume: {
                label: "Download CV",
                fileUrl: "/resume.pdf",
            },
        },
    },
    workExperiences: [
        {
            id: "placeholder-company",
            companyName: "Product Studio",
            isCurrentEmployer: true,
            positions: [
                {
                    id: "placeholder-role",
                    title: "Frontend Developer",
                    category: "professional",
                    startDate: "2024-01-01",
                    employmentType: "Full-time",
                    icon: "code",
                    isExpanded: true,
                    description: [
                        "Built responsive interfaces with reusable components and accessible interaction patterns.",
                        "Collaborated across product and design to ship maintainable, user-focused features.",
                    ],
                    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
                },
            ],
        },
    ],
} satisfies LandingPageContentType;

export function useLandingPageContent(initialData?: LandingPageContentType) {
    return useQuery({
        queryKey: landingPageContentQueryKey,
        queryFn: getLandingPageContent,
        initialData,
        placeholderData: landingPagePlaceholderContent,
    });
}
