import "server-only";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ZodError, type ZodType } from "zod";
import { adminCookieName } from "@/lib/admin-session";
import { adminSessionsService } from "@/backend/services/admin-sessions";
import { AdminError } from "@/backend/errors/admin";
import { adminModules, type AdminModuleId } from "@/config/admin-modules";

export function privateJson(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
    return Response.json(data, { status, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", ...extraHeaders } });
}
export function expectedOrigin(request: Request) { return process.env.ADMIN_ORIGIN ? new URL(process.env.ADMIN_ORIGIN).origin : new URL(request.url).origin; }
export function checkAdminOrigin(request: Request) {
    if (request.headers.get("origin") !== expectedOrigin(request) || request.headers.get("x-admin-request") !== "1" || !request.headers.get("content-type")?.startsWith("application/json")) {
        throw new AdminError(403, "This request could not be verified. Reload the page and try again.");
    }
}
export async function adminRequest(request: Request, operation: () => Promise<Response>, authenticated = true) {
    try {
        if (request.method !== "GET") checkAdminOrigin(request);
        if (authenticated) {
            const session = await adminSessionsService.validate((await cookies()).get(adminCookieName)?.value);
            if (!session) throw new AdminError(401, "Your session has expired. Sign in again, then retry saving.");
        }
        return await operation();
    } catch (error) {
        if (error instanceof AdminError) return privateJson({ error: error.message, fields: error.fields }, error.status, error.retryAfter ? { "Retry-After": String(error.retryAfter) } : {});
        if (error instanceof ZodError) {
            const fields: Record<string, string[]> = {};
            for (const issue of error.issues) (fields[String(issue.path[0] ?? "form")] ??= []).push(issue.message);
            return privateJson({ error: "Please check the highlighted fields.", fields }, 422);
        }
        let cause: unknown = error;
        for (let depth = 0; depth < 4 && cause && typeof cause === "object"; depth++) {
            if ("code" in cause && cause.code === "23505") return privateJson({ error: "That URL is already in use.", fields: { slug: ["Choose a unique URL"] } }, 409);
            cause = "cause" in cause ? cause.cause : null;
        }
        console.error("An admin request could not be completed");
        return privateJson({ error: "This service is temporarily unavailable. Your changes have not been discarded. Please try again." }, 503);
    }
}
export async function readAdminBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
    const reader = request.body?.getReader();
    if (!reader) throw new AdminError(422, "A request body is required");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > 600000) { await reader.cancel(); throw new AdminError(422, "This content is too large"); }
        chunks.push(chunk.value);
    }
    let value;
    try { value = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new AdminError(422, "Enter valid content"); }
    return schema.parse(value);
}
export function adminId(value: string) {
    if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) throw new AdminError(404, "Item not found");
    return Number(value);
}
export function refreshAdminModule(id: AdminModuleId) {
    const definition = adminModules.find(entry => entry.id === id)!;
    revalidatePath("/admin", "layout");
    for (const entry of definition.revalidate) revalidatePath(entry.path, "type" in entry ? entry.type : undefined);
}
