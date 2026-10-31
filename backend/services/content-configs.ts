import "server-only";
import { contentConfigsRepository } from "@/backend/repository/content_configs";
import type { LandingPageContentType } from "@/shared/contracts/landing-page";

async function readLandingPageContent(): Promise<LandingPageContentType> {
    const record = await contentConfigsRepository.findByKey("landing-page");
    if (!record || !record.content) {
        throw new Error("Landing page content is not configured");
    }
    return record.content as LandingPageContentType;
}

export const contentConfigsService = { readLandingPageContent };
