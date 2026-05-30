import type { ExperienceItemType } from "./types";
import { getLandingPageContent } from "@/features/landing-page/api";

export async function getWorkExperiences(): Promise<ExperienceItemType[]> {
    const landingPageContent = await getLandingPageContent();

    return landingPageContent.workExperiences;
}
