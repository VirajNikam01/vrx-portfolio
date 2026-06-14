import { landingPageContent } from "@/config/landing-page";
import type { JsonValue } from "@/lib/db/schema";

function toJsonValue(value: unknown): JsonValue {
    return JSON.parse(JSON.stringify(value)) as JsonValue;
}

export const landingPageSeedDataDate = new Date("2026-05-26T00:00:00.000Z");

export const landingPageSeedData = {
    key: landingPageContent.page.key,
    path: landingPageContent.page.path,
    title: landingPageContent.page.title,
    status: "published" as const,
    schemaVersion: 1,
    content: toJsonValue(landingPageContent),
    publishedAt: landingPageSeedDataDate,
};
