import { useQuery } from "@tanstack/react-query";

import { getLandingPageContent } from "./api";

export const landingPageContentQueryKey = ["landing-page-content"] as const;

export function useLandingPageContent() {
    return useQuery({
        queryKey: landingPageContentQueryKey,
        queryFn: getLandingPageContent,
    });
}
