import { workExperiences } from "@/config/work-experience";
import { readLandingPageContent } from "@/features/landing-page/repository";

import { workExperiencesSchema } from "./schema";
import type { ExperienceItemType } from "./types";

export async function readWorkExperiences(): Promise<ExperienceItemType[]> {
    try {
        const content = await readLandingPageContent();

        return workExperiencesSchema.parse(content.workExperiences);
    } catch {
        return workExperiences;
    }
}
