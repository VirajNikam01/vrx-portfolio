import { landingPageContent } from "@/config/landing-page";
import type { LandingPageContentType } from "./types";

export function useLandingPageContent(initialData?: LandingPageContentType) {
    return {
        data: initialData ?? landingPageContent,
    };
}
