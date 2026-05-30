import type { IntroductionContentType } from "./types";
import { getLandingPageContent } from "@/features/landing-page/api";

export async function getIntroductionContent(): Promise<IntroductionContentType> {
    const landingPageContent = await getLandingPageContent();

    return landingPageContent.introduction;
}
