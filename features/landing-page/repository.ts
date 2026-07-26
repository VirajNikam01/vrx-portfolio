import { landingPageContent } from "@/config/landing-page";
import type { LandingPageContentType } from "./types";
import { getDb } from "@/lib/db/client";
import { ContentConfig, contentConfigs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function readLandingPageContent(): Promise<LandingPageContentType> {
    try {
        const [result] = await getDb()
            .select()
            .from(contentConfigs)
            .where(eq(contentConfigs.key, "landing-page"))
            .limit(1);

        if (!result) return landingPageContent;
        return result.content as LandingPageContentType;
    } catch (error) {
        console.log("Failed to get Content:", error)
        return landingPageContent;
    };
}
