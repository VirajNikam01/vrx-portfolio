import { useQuery } from "@tanstack/react-query";
import { landingPageApi } from "@/lib/api/landing-page";
import { queryKeys } from "@/data/query-keys";
import { landingPageContent } from "@/config/landing-page";

export function useLandingPageContent() {
    const query = useQuery({
        queryKey: queryKeys.landingPageContent,
        queryFn: landingPageApi.fetchLandingPageContent,
        retryOnMount: false,
        staleTime: Infinity,
        gcTime: Infinity,
    })

    return {
        ...query,
        data: query.data ?? (query.isError ? { data: landingPageContent } : undefined),
    };
}



