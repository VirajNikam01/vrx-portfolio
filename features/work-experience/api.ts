import { workExperiences } from "@/config/work-experience";
import { httpClient } from "@/lib/api/http-client";
import type { ExperienceItemType } from "./types";
import { workExperiencesResponseSchema } from "./schema";

const WORK_EXPERIENCE_ENDPOINT = "/work-experience";

function resolveWorkExperiencePayload(payload: unknown): ExperienceItemType[] {
    const parsedPayload = workExperiencesResponseSchema.parse(payload);

    return Array.isArray(parsedPayload) ? parsedPayload : parsedPayload.data;
}

export async function getWorkExperiences(): Promise<ExperienceItemType[]> {
    try {
        const response = await httpClient.get<unknown>(WORK_EXPERIENCE_ENDPOINT);

        return resolveWorkExperiencePayload(response.data);
    } catch {
        return workExperiences;
    }
}
