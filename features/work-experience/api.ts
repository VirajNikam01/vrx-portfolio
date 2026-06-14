import { workExperiences } from "@/config/work-experience";
import type { ExperienceItemType } from "./types";

export async function getWorkExperiences(): Promise<ExperienceItemType[]> {
    return workExperiences;
}
