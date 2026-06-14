import { landingPageContent } from "@/config/landing-page";
import type { LandingPageContentType } from "./types";

export async function getLandingPageContent(): Promise<LandingPageContentType> {
    return landingPageContent;
}
