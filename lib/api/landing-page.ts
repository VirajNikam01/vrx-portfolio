import { apiClient } from "@/lib/api/client";
import type { LandingPageContentType } from "@/shared/contracts/landing-page";


async function fetchLandingPageContent(): Promise<{ data: LandingPageContentType }> {
    const response = await apiClient.get<{ data: LandingPageContentType }>("/content/landing-page");
    if (response.status !== 200 || !response.data?.data) {
        throw new Error("Landing page content is unavailable");
    }
    return response.data;
}

export const landingPageApi = {
    fetchLandingPageContent,
};


export async function getLandingPageContent(): Promise<LandingPageContentType> {
    const response = await fetchLandingPageContent();
    return response.data;
}
