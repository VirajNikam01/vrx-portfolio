import { landingPageContent } from "@/config/landing-page";
import { httpClient } from "@/lib/api/http-client";

import { landingPageContentResponseSchema } from "./schema";
import type { LandingPageContentType } from "./types";

const LANDING_PAGE_CONTENT_ENDPOINT = "/content/landing-page";

function resolveLandingPagePayload(payload: unknown): LandingPageContentType {
    const parsedPayload = landingPageContentResponseSchema.parse(payload);

    return "data" in parsedPayload ? parsedPayload.data : parsedPayload;
}

export async function getLandingPageContent(): Promise<LandingPageContentType> {
    try {
        const response = await httpClient.get<unknown>(
            LANDING_PAGE_CONTENT_ENDPOINT,
        );

        return resolveLandingPagePayload(response.data);
    } catch {
        return landingPageContent;
    }
}
