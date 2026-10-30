import "server-only";
import { contentConfigsRepository } from "@/backend/repository/content_configs";
import { landingPageContent } from "@/config/landing-page";
import type { LandingPageContentType } from "@/shared/contracts/landing-page";

async function readLandingPageContent(): Promise<LandingPageContentType> {
    try {
        const record = await contentConfigsRepository.findByKey("landing-page");
        return record ? record.content as LandingPageContentType : landingPageContent;
    } catch (error) {
        console.log("Failed to get Content:", error);
        return landingPageContent;
    }
}

export const contentConfigsService = { readLandingPageContent };
