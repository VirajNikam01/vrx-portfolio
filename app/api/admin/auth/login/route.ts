import { cookies } from "next/headers";
import { adminAuthService } from "@/backend/services/admin-auth";
import { adminCookieName } from "@/lib/admin-session";
import { adminLoginSchema } from "@/shared/contracts/admin";
import { adminRequest, expectedOrigin, privateJson, readAdminBody } from "../../request";

export async function POST(request: Request) {
    return adminRequest(request, async () => {
        const input = await readAdminBody(request, adminLoginSchema);
        const store = await cookies();
        // The account bucket remains effective even without a trusted deployment IP header.
        const ip = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ?? "unknown" : "local";
        const session = await adminAuthService.login(input.email, input.password, ip, store.get(adminCookieName)?.value);
        store.set(adminCookieName, session.token, { httpOnly: true, secure: expectedOrigin(request).startsWith("https:"), sameSite: "strict", path: "/", expires: session.expiresAt });
        return privateJson({ data: { signedIn: true } });
    }, false);
}
