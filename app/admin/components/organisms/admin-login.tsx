"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, AdminRequestError } from "@/lib/api/admin";
import { safeAdminReturn } from "@/shared/contracts/admin";
import { AdminField, adminButtonClass, adminInputClass } from "@/app/admin/components/molecules/admin-field";

export function AdminLogin({ returnTo }: { returnTo: string }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setPending(true); setError(null);
        try {
            await adminFetch("/auth/login", "POST", { email: data.get("email"), password: data.get("password") });
            router.replace(safeAdminReturn(returnTo)); router.refresh();
        } catch (failure) { setError(failure instanceof Error ? failure : new Error("Unable to sign in right now. Please try again.")); setPending(false); }
    }
    const fields = error instanceof AdminRequestError ? error.fields : {};
    return <section className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Owner access</p>
        <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mb-8 mt-3 text-sm leading-6 text-muted-foreground">Manage your website content and settings.</p>
        <form onSubmit={submit} className="space-y-5">
            <AdminField label="Email" name="email" error={fields.email}><input id="email" name="email" type="email" autoComplete="username" required maxLength={254} className={adminInputClass} /></AdminField>
            <AdminField label="Password" name="password" error={fields.password}><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required maxLength={1024} className={adminInputClass} /></AdminField>
            <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={showPassword} onChange={event => setShowPassword(event.target.checked)} />Show password</label>
            {error && <p role="alert" className="text-sm text-destructive">{error.message}</p>}
            <button disabled={pending} className={`${adminButtonClass} w-full`}>{pending ? "Signing in…" : "Sign in"}</button>
        </form>
    </section>;
}
