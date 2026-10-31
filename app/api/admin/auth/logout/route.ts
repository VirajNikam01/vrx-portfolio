import { cookies } from "next/headers";
import { adminSessionsService } from "@/backend/services/admin-sessions";
import { adminCookieName } from "@/lib/admin-session";
import { adminRequest, expectedOrigin, privateJson } from "../../request";

export async function POST(request: Request) {
    return adminRequest(request, async () => {
        const store = await cookies();
        await adminSessionsService.revoke(store.get(adminCookieName)?.value);
        store.set(adminCookieName, "", { httpOnly: true, secure: expectedOrigin(request).startsWith("https:"), sameSite: "strict", path: "/", maxAge: 0 });
        return privateJson({ data: { signedOut: true } });
    }, false);
}
