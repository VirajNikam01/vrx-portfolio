
export function getOrCreateVisitorId(): string {
    const key = "_vid";
    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
    }
    return id;
}

export function collectClientFingerprint() {
    return {
        visitorId: getOrCreateVisitorId(),
        // device
        screen: `${screen.width}x${screen.height}`,
        devicePixelRatio: devicePixelRatio,
        platform: navigator.platform,
        // browser
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        // stable signals
        hardwareConcurrency: navigator.hardwareConcurrency,
        maxTouchPoints: navigator.maxTouchPoints,
        colorDepth: screen.colorDepth,
    };
}

export async function generateFingerprintHash(fp: object): Promise<string> {
    const str = JSON.stringify(fp);
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function getClientFingerprintHash(): Promise<string> {
    const fp = collectClientFingerprint();
    return generateFingerprintHash(fp);
}