export function serializeJsonLd(payload: unknown) {
    return JSON.stringify(payload).replace(/</g, "\\u003c");
}
