export type InquiryRequestMetadata = {
    userAgent?: string;
    referer?: string;
    ip?: string;
    acceptLanguage?: string;
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
    fingerprintHash?: string;
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
        fingerprintHash: getHeader(request.headers, "x-client-fp"),
        userAgent: getHeader(request.headers, "user-agent"),
        referer: getHeader(request.headers, "referer"),
        acceptLanguage: getHeader(request.headers, "accept-language"),
        ip: getHeader(request.headers, "x-forwarded-for")?.split(",")[0].trim(),
        country: getHeader(request.headers, "x-vercel-ip-country"),
        region: getHeader(request.headers, "x-vercel-ip-country-region"),
        city: getHeader(request.headers, "x-vercel-ip-city"),
        timezone: getHeader(request.headers, "x-vercel-ip-timezone"),
    });
}


