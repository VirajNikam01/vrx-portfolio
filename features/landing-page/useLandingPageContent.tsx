import { landingPageContent } from "@/config/landing-page";
import type { LandingPageContentType } from "./types";
import { useQuery } from "@tanstack/react-query";
import { landingPageAction } from "@/actions/landing-page";
import { error } from "console";
import { queryClient } from "@/config/query-client";
import { queryKeys } from "@/data/query-keys";

export function useLandingPageContent() {
    return useQuery({
        queryKey: queryKeys.landingPageContent,
        queryFn: landingPageAction.fetchLandingPageContent,
        /*
        ** we are prefetching teh request data, so there will be no role of placeholder,
           but need to keep for building next build During prerender/SSR
        */
        placeholderData: { data: landingPageContent },
        staleTime: Infinity,
        gcTime: Infinity,
    })
}



