import { serializeJsonLd } from "@/lib/seo/serialize-json-ld";

type JsonLdProps = { data: unknown };

export function JsonLd({ data }: JsonLdProps) {
    const serializedData = serializeJsonLd(data);
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializedData }} />;
}
