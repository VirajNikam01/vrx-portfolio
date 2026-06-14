import {
    getPersonJsonLd,
    getProfilePageJsonLd,
    getWebsiteJsonLd,
    serializeJsonLd,
} from "@/config/seo";
import { HomePageClient } from "@/components/pages/landing-page/home-page-client";
import { landingPageContent } from "@/config/landing-page";

export default async function Home() {
    const jsonLd = [
        getWebsiteJsonLd(),
        getPersonJsonLd(),
        getProfilePageJsonLd(),
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serializeJsonLd(jsonLd),
                }}
            />
            <HomePageClient content={landingPageContent} />
        </>
    );
}
