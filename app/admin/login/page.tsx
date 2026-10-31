import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminCookieName } from "@/lib/admin-session";
import { adminSessionsService } from "@/backend/services/admin-sessions";
import { safeAdminReturn } from "@/shared/contracts/admin";
import { AdminLogin } from "@/app/admin/components/organisms/admin-login";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string | string[] }> }) {
    const value = (await searchParams).returnTo;
    const returnTo = safeAdminReturn(typeof value === "string" ? value : null);
    if (await adminSessionsService.validate((await cookies()).get(adminCookieName)?.value)) redirect(returnTo);
    return <AdminLogin returnTo={returnTo} />;
}
