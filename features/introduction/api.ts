import type { IntroductionContentType } from "./types";
import { introductionContent } from "@/config/introduction";
import { httpClient } from "@/lib/api/http-client";

import { introductionContentResponseSchema } from "./schema";

const INTRODUCTION_CONTENT_ENDPOINT = "/content/introduction";

function resolveIntroductionPayload(payload: unknown): IntroductionContentType {
    const parsedPayload = introductionContentResponseSchema.parse(payload);

    return "data" in parsedPayload ? parsedPayload.data : parsedPayload;
}

export async function getIntroductionContent(): Promise<IntroductionContentType> {
    try {
        const response = await httpClient.get<unknown>(
            INTRODUCTION_CONTENT_ENDPOINT,
        );

        return resolveIntroductionPayload(response.data);
    } catch {
        return introductionContent;
    }
}
