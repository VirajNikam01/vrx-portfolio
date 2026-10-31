export class AdminRequestError extends Error {
    constructor(message: string, public status: number, public fields: Record<string, string[]> = {}) { super(message); }
}

export async function adminFetch<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    const response = await fetch(`/api/admin${path}`, {
        method, credentials: "same-origin", cache: "no-store",
        headers: { "Content-Type": "application/json", "x-admin-request": "1" },
        ...(method !== "GET" ? { body: JSON.stringify(body ?? {}) } : {}),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new AdminRequestError(payload?.error ?? "The request failed. Please try again.", response.status, payload?.fields ?? {});
    if (!payload || !("data" in payload)) throw new AdminRequestError("The service returned an invalid response. Please try again.", 503);
    return payload.data;
}
