import {
    getPersonJsonLd,
    getProfilePageJsonLd,
    getWebsiteJsonLd,
    serializeJsonLd,
} from "@/config/seo";
import { HomePageClient } from "@/components/pages/landing-page/home-page-client";
import { landingPageContent } from "@/config/landing-page";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/data/query-keys";
import { landingPageAction } from "@/actions/landing-page";
import { makeQueryClient } from "@/config/query-client";

export default async function Home() {
    const jsonLd = [
        getWebsiteJsonLd(),
        getPersonJsonLd(),
        getProfilePageJsonLd(),
    ];

    const queryClient = makeQueryClient();

    await queryClient.prefetchQuery({
        queryKey: queryKeys.landingPageContent,
        queryFn: landingPageAction.fetchLandingPageContent,
        staleTime: Infinity,
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serializeJsonLd(jsonLd),
                }}
            />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <HomePageClient />
            </HydrationBoundary>
        </>
    );
}
