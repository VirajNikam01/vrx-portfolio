"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/api/admin";
import { adminSecondaryClass } from "./admin-field";

export function AdminLogout() {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    return <div className="flex flex-wrap items-center gap-3">
        {error && <span role="alert" className="text-xs text-destructive">{error}</span>}
        <button type="button" disabled={pending} className={adminSecondaryClass} onClick={async () => {
            if (!window.dispatchEvent(new Event("admin:leaving", { cancelable: true }))) return;
            setPending(true); setError("");
            try { await adminFetch("/auth/logout", "POST"); router.replace("/admin/login"); router.refresh(); }
            catch { setPending(false); setError("Unable to sign out. Please try again."); }
        }}>{pending ? "Signing out…" : "Sign out"}</button>
    </div>;
}
