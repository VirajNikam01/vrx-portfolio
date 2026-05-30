import { landingPageContent } from "@/config/landing-page";
import type { JsonValue } from "@/lib/db/schema";

function toJsonValue(value: unknown): JsonValue {
    return JSON.parse(JSON.stringify(value)) as JsonValue;
}

const landingPageSeedDataDate = new Date("2026-05-26T00:00:00.000Z");

export const landingPageSeedData = {
    page: {
        key: landingPageContent.page.key,
        path: landingPageContent.page.path,
        title: landingPageContent.page.title,
        status: "published" as const,
        publishedAt: landingPageSeedDataDate,
    },
    sections: [
        {
            key: "introduction",
            componentKey: "Introduction",
            title: "Introduction",
            status: "published" as const,
            isEnabled: landingPageContent.featureFlags.showIntroduction,
            sortOrder: 10,
            props: toJsonValue(
                landingPageContent.sections.find(
                    (section) => section.key === "introduction",
                )?.props ?? {},
            ),
            content: toJsonValue(landingPageContent.introduction),
            visibilityRules: toJsonValue({
                featureFlagKey: "showIntroduction",
            }),
            designOverrides: toJsonValue({}),
            dataSource: toJsonValue({
                type: "inline",
                configKey: "introduction",
            }),
            metadata: toJsonValue({
                description: "Landing page introduction hero content.",
            }),
            publishedAt: landingPageSeedDataDate,
        },
        {
            key: "workExperience",
            componentKey: "WorkExperience",
            title: "Work Experience",
            status: "published" as const,
            isEnabled: landingPageContent.featureFlags.showWorkExperience,
            sortOrder: 20,
            props: toJsonValue(
                landingPageContent.sections.find(
                    (section) => section.key === "workExperience",
                )?.props ?? {},
            ),
            content: toJsonValue(landingPageContent.workExperiences),
            visibilityRules: toJsonValue({
                featureFlagKey: "showWorkExperience",
            }),
            designOverrides: toJsonValue({}),
            dataSource: toJsonValue({
                type: "inline",
                configKey: "workExperiences",
            }),
            metadata: toJsonValue({
                description: "Config-driven work history timeline.",
            }),
            publishedAt: landingPageSeedDataDate,
        },
    ],
    featureFlags: [
        {
            key: "showIntroduction",
            name: "Show introduction section",
            description: "Controls whether the landing introduction renders.",
            isEnabled: landingPageContent.featureFlags.showIntroduction,
            defaultVariantKey: "on",
            owner: "portfolio",
            metadata: toJsonValue({
                scope: "landing-page",
                sectionKey: "introduction",
            }),
        },
        {
            key: "showWorkExperience",
            name: "Show work experience section",
            description: "Controls whether the work experience timeline renders.",
            isEnabled: landingPageContent.featureFlags.showWorkExperience,
            defaultVariantKey: "on",
            owner: "portfolio",
            metadata: toJsonValue({
                scope: "landing-page",
                sectionKey: "workExperience",
            }),
        },
    ],
    featureFlagVariants: [
        {
            flagKey: "showIntroduction",
            key: "off",
            name: "Hidden",
            isEnabled: true,
            weight: 0,
            sortOrder: 0,
            payload: toJsonValue({ isVisible: false }),
        },
        {
            flagKey: "showIntroduction",
            key: "on",
            name: "Visible",
            isEnabled: true,
            weight: 100,
            sortOrder: 10,
            payload: toJsonValue({ isVisible: true }),
        },
        {
            flagKey: "showWorkExperience",
            key: "off",
            name: "Hidden",
            isEnabled: true,
            weight: 0,
            sortOrder: 0,
            payload: toJsonValue({ isVisible: false }),
        },
        {
            flagKey: "showWorkExperience",
            key: "on",
            name: "Visible",
            isEnabled: true,
            weight: 100,
            sortOrder: 10,
            payload: toJsonValue({ isVisible: true }),
        },
    ],
    featureFlagRules: [
        {
            flagKey: "showIntroduction",
            key: "production-default",
            environment: "production",
            ruleType: "variant" as const,
            variantKey: "on",
            priority: 100,
            isEnabled: true,
            rolloutPercentage: 100,
            conditions: toJsonValue({}),
            metadata: toJsonValue({ reason: "Default published experience." }),
        },
        {
            flagKey: "showWorkExperience",
            key: "production-default",
            environment: "production",
            ruleType: "variant" as const,
            variantKey: "on",
            priority: 100,
            isEnabled: true,
            rolloutPercentage: 100,
            conditions: toJsonValue({}),
            metadata: toJsonValue({ reason: "Default published experience." }),
        },
    ],
    designConfigs: [
        {
            key: "portfolio-default",
            scope: "landing-page",
            name: "Portfolio default landing page design",
            isActive: true,
            schemaVersion: 1,
            tokens: toJsonValue({
                layout: {
                    maxWidth: "5xl",
                    sectionPaddingY: "20",
                },
            }),
            componentVariants: toJsonValue({
                Introduction: "centered-avatar",
                WorkExperience: "timeline-compact",
            }),
            metadata: toJsonValue({
                description:
                    "Base design tokens and component variants for the landing page.",
            }),
        },
    ],
};
