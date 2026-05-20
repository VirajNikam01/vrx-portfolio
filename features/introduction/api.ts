import { introductionContent } from "@/config/introduction";
import { httpClient } from "@/lib/api/http-client";
import { introductionContentResponseSchema } from "./schema";
import type { IntroductionContentType } from "./types";

const INTRODUCTION_ENDPOINT = "/introduction";

function resolveIntroductionPayload(payload: unknown): IntroductionContentType {
    const parsedPayload = introductionContentResponseSchema.parse(payload);

    return "data" in parsedPayload ? parsedPayload.data : parsedPayload;
}

export async function getIntroductionContent(): Promise<IntroductionContentType> {
    try {
        const response = await httpClient.get<unknown>(INTRODUCTION_ENDPOINT);

        return resolveIntroductionPayload(response.data);
    } catch {
        return introductionContent;
    }
}
