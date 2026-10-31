import { workExperiences } from "@/config/work-experience";
import type { ExperienceItemType } from "@/shared/contracts/work-experience";

export async function getWorkExperiences(): Promise<ExperienceItemType[]> {
    return workExperiences;
}
