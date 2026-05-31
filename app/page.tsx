import { readLandingPageContent } from "@/features/landing-page/repository";
import {
    getPersonJsonLd,
    getProfilePageJsonLd,
    getWebsiteJsonLd,
    serializeJsonLd,
} from "@/config/seo";
import { HomePageClient } from "@/components/pages/landing-page/home-page-client";

export default async function Home() {
    const content = await readLandingPageContent();
    const jsonLd = [
        getWebsiteJsonLd(),
        getPersonJsonLd(content),
        getProfilePageJsonLd(content),
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serializeJsonLd(jsonLd),
                }}
            />
            <HomePageClient initialContent={content} />
        </>
    );
}
