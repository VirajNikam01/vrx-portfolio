import { workExperiences } from "@/config/work-experience";

import type { ExperienceItemType } from "./types";

export async function readWorkExperiences(): Promise<ExperienceItemType[]> {
    return workExperiences;
}
