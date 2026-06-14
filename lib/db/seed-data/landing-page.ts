import { landingPageContent } from "@/config/landing-page";

type JsonValue = unknown;

function toJsonValue(value: unknown): JsonValue {
    return JSON.parse(JSON.stringify(value)) as JsonValue;
}

export const landingPageSeedDataDate = new Date("2026-05-26T00:00:00.000Z");

export const landingPageSeedData = {
    key: "landing-page",
    path: "/",
    title: "Viraj Nikam Portfolio",
    status: "published" as const,
    schemaVersion: 1,
    content: toJsonValue({
        introduction: landingPageContent.introduction,
        workExperiences: landingPageContent.workExperiences,
    }),
    config: toJsonValue({
        featureFlags: landingPageContent.featureFlags,
    }),
    publishedAt: landingPageSeedDataDate,
};
