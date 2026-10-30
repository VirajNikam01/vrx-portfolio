export function runInBrowser(fn: () => void): void {
    if (typeof window !== "undefined") fn();
}

export async function runInBrowserAsync<T>(fn: () => Promise<T>): Promise<T | undefined> {
    if (typeof window !== "undefined") return fn();
}