import type { ReactNode } from "react";
import { readAdminSession } from "@/lib/admin-session";
import { AdminLogout } from "@/app/admin/components/molecules/admin-logout";
import { AdminNavigation } from "@/app/admin/components/organisms/admin-navigation";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
    const session = await readAdminSession();
    // Each page performs its own guard, preserving its exact login return URL.
    if (!session) return children;
    return <><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><span className="break-all text-xs text-muted-foreground">Signed in as {session.email}</span><AdminLogout /></div><AdminNavigation />{children}</>;
}
