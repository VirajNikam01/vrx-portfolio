import { landingPageContent } from "@/config/landing-page";
import type { LandingPageContentType } from "./types";

export async function readLandingPageContent(): Promise<LandingPageContentType> {
    return landingPageContent;
}
