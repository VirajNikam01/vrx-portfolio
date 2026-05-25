export type InquiryRequestMetadata = {
    userAgent?: string;
    referer?: string;
    acceptLanguage?: string;
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
};

function getHeader(headers: Headers, name: string) {
    return headers.get(name)?.trim() || undefined;
}

function compactMetadata(metadata: InquiryRequestMetadata) {
    return Object.fromEntries(
        Object.entries(metadata).filter(([, value]) => Boolean(value)),
    ) as InquiryRequestMetadata;
}

export function collectInquiryRequestMetadata(request: Request) {
    return compactMetadata({
        userAgent: getHeader(request.headers, "user-agent"),
        referer: getHeader(request.headers, "referer"),
        acceptLanguage: getHeader(request.headers, "accept-language"),
        country: getHeader(request.headers, "x-vercel-ip-country"),
        region: getHeader(request.headers, "x-vercel-ip-country-region"),
        city: getHeader(request.headers, "x-vercel-ip-city"),
        timezone: getHeader(request.headers, "x-vercel-ip-timezone"),
    });
}
