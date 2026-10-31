import "server-only";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { adminSessionsService } from "@/backend/services/admin-sessions";
import { cache } from "react";

export const adminCookieName = "bookshelf_admin_session";
export function adminPageId(value: string) {
    if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) notFound();
    return Number(value);
}
export const readAdminSession = cache(async () => {
    const token = (await cookies()).get(adminCookieName)?.value;
    return adminSessionsService.validate(token);
});
export async function requireAdminPage(returnTo = "/admin") {
    const session = await readAdminSession();
    if (!session) redirect(`/admin/login?returnTo=${encodeURIComponent(returnTo)}`);
    return session;
}
