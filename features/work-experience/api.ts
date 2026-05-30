import type { ExperienceItemType } from "./types";
import { workExperiences } from "@/config/work-experience";
import { httpClient } from "@/lib/api/http-client";

import { workExperiencesResponseSchema } from "./schema";

const WORK_EXPERIENCE_CONTENT_ENDPOINT = "/content/work-experience";

function resolveWorkExperiencesPayload(payload: unknown): ExperienceItemType[] {
    const parsedPayload = workExperiencesResponseSchema.parse(payload);

    return "data" in parsedPayload ? parsedPayload.data : parsedPayload;
}

export async function getWorkExperiences(): Promise<ExperienceItemType[]> {
    try {
        const response = await httpClient.get<unknown>(
            WORK_EXPERIENCE_CONTENT_ENDPOINT,
        );

        return resolveWorkExperiencesPayload(response.data);
    } catch {
        return workExperiences;
    }
}
