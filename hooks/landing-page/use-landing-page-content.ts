import { landingPageContent } from "@/config/landing-page";
import { useQuery } from "@tanstack/react-query";
import { landingPageApi } from "@/lib/api/landing-page";
import { queryKeys } from "@/data/query-keys";

export function useLandingPageContent() {
    return useQuery({
        queryKey: queryKeys.landingPageContent,
        queryFn: landingPageApi.fetchLandingPageContent,
        /*
        ** we are prefetching teh request data, so there will be no role of placeholder,
           but need to keep for building next build During prerender/SSR
        */
        placeholderData: { data: landingPageContent },
        staleTime: Infinity,
        gcTime: Infinity,
    })
}



