import { HomePageClient } from "@/app/home-page-client";
import { JsonLd } from "@/app/components/atoms/json-ld";
import { homeMetadata } from "@/lib/seo/metadata";
import { getHomeJsonLd } from "@/lib/seo/structured-data";

export const metadata = homeMetadata;

export default function Home() {
    const structuredData = getHomeJsonLd();
    return (
        <>
            <JsonLd data={structuredData} />
            <HomePageClient />
        </>
    );
}
