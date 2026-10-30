import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | undefined;

function getRequiredEnv(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is required for Supabase server access.`);
    }

    return value;
}

export function getSupabaseServerClient() {
    supabase ??= createClient(
        getRequiredEnv("SUPABASE_URL"),
        getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        },
    );

    return supabase;
}
