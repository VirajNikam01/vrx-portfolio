"use client";

import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { editableFeatureFlags, type FeatureFlagsSettings } from "@/shared/contracts/site-settings";
import { adminFetch } from "@/lib/api/admin";
import { queryKeys } from "@/data/query-keys";
import { useUnsavedChanges } from "@/hooks/admin/use-unsaved-changes";
import { AdminSaveError } from "@/app/admin/components/molecules/admin-save-error";
import { adminButtonClass } from "@/app/admin/components/molecules/admin-field";

export function FeatureFlagsEditor({ initialSettings }: { initialSettings: FeatureFlagsSettings }) {
    const [settings, setSettings] = useState(initialSettings);
    const [baseline, setBaseline] = useState(JSON.stringify(initialSettings));
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [saved, setSaved] = useState(false);
    const queryClient = useQueryClient();
    const dirty = JSON.stringify(settings) !== baseline;
    useUnsavedChanges(dirty);
    async function save(event: FormEvent) {
        event.preventDefault(); setPending(true); setError(null); setSaved(false);
        try {
            const result = await adminFetch<FeatureFlagsSettings>("/settings/feature-flags", "PATCH", settings);
            setSettings(result); setBaseline(JSON.stringify(result)); setSaved(true);
            await queryClient.invalidateQueries({ queryKey: queryKeys.landingPageContent });
        } catch (failure) { setError(failure instanceof Error ? failure : new Error("Unable to save settings")); }
        finally { setPending(false); }
    }
    return <section className="max-w-3xl space-y-7">
        <div><h1 className="text-3xl font-semibold tracking-tight">Feature flags</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Choose which homepage sections are visible. A section also needs configured content to appear.</p></div>
        <AdminSaveError error={error} />
        {saved && <p role="status" className="rounded-xl bg-primary/10 p-4 text-sm text-primary">Feature flags saved.</p>}
        <form onSubmit={save} className="space-y-6">
            <fieldset disabled={pending} className="divide-y divide-border rounded-2xl border border-border bg-card">
                <legend className="sr-only">Homepage section visibility</legend>
                {editableFeatureFlags.map(flag => <label key={flag.key} className="flex min-h-20 cursor-pointer items-center justify-between gap-6 p-5 sm:p-6">
                    <span><span className="block text-sm font-medium">{flag.label}</span><span className="mt-2 block text-xs leading-5 text-muted-foreground">{flag.description}</span></span>
                    <input type="checkbox" role="switch" aria-label={flag.label} checked={settings.flags[flag.key]} onChange={event => { const checked = event.target.checked; setSaved(false); setSettings(current => ({ ...current, flags: { ...current.flags, [flag.key]: checked } })); }} className="size-5 shrink-0 accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </label>)}
            </fieldset>
            <div className="flex flex-wrap items-center gap-4"><button disabled={pending || !dirty} className={adminButtonClass}>{pending ? "Saving…" : "Save feature flags"}</button><span className="text-xs text-muted-foreground">{dirty ? "Unsaved changes" : "All changes saved"}</span></div>
        </form>
    </section>;
}
