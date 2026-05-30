import { landingPageContent } from "@/config/landing-page";
import { introductionContent } from "@/config/introduction";
import { workExperiences } from "@/config/work-experience";
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
    introduction: {
        key: "landing-page-introduction",
        eyebrow: introductionContent.eyebrow,
        headline: introductionContent.headline,
        intro: introductionContent.intro,
        imageSrc: introductionContent.image.src,
        imageAlt: introductionContent.image.alt,
        status: "published" as const,
        metadata: toJsonValue({
            scope: "landing-page",
            sectionKey: "introduction",
        }),
        publishedAt: landingPageSeedDataDate,
    },
    introductionStatementSegments: introductionContent.statement.map(
        (segment, index) => ({
            text: segment.text,
            emphasis: segment.emphasis,
            sortOrder: index * 10,
            metadata: toJsonValue({}),
        }),
    ),
    introductionActions: [
        {
            kind: "connect" as const,
            label: introductionContent.actions.connect.label,
            href: introductionContent.actions.connect.href,
            fileUrl: null,
            sortOrder: 10,
            metadata: toJsonValue({}),
        },
        {
            kind: "resume" as const,
            label: introductionContent.actions.resume.label,
            href: null,
            fileUrl: introductionContent.actions.resume.fileUrl,
            sortOrder: 20,
            metadata: toJsonValue({}),
        },
    ],
    workExperienceCompanies: workExperiences.map((experience, index) => ({
        key: experience.id,
        companyName: experience.companyName,
        companyLogo: experience.companyLogo,
        isCurrentEmployer: experience.isCurrentEmployer ?? false,
        status: "published" as const,
        sortOrder: index * 10,
        metadata: toJsonValue({ scope: "landing-page" }),
        publishedAt: landingPageSeedDataDate,
        positions: experience.positions.map((position, positionIndex) => ({
            key: position.id,
            title: position.title,
            category: position.category,
            startDate: position.startDate,
            endDate: position.endDate,
            employmentType: position.employmentType,
            icon: position.icon,
            isExpanded: position.isExpanded ?? false,
            sortOrder: positionIndex * 10,
            metadata: toJsonValue({}),
            descriptions: (position.description ?? []).map(
                (description, descriptionIndex) => ({
                    body: description,
                    sortOrder: descriptionIndex * 10,
                    metadata: toJsonValue({}),
                }),
            ),
            skills: (position.skills ?? []).map((skill, skillIndex) => ({
                name: skill,
                sortOrder: skillIndex * 10,
                metadata: toJsonValue({}),
            })),
        })),
    })),
};
