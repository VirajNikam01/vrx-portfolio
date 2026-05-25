import { getSupabaseServerClient } from "@/lib/supabase/server";

const defaultSignedUrlExpiresInSeconds = 60 * 60 * 24;

function getResumeSignedUrlExpiresIn() {
    const rawValue = process.env.RESUME_SIGNED_URL_EXPIRES_SECONDS;

    if (!rawValue) {
        return defaultSignedUrlExpiresInSeconds;
    }

    const parsedValue = Number.parseInt(rawValue, 10);

    return Number.isFinite(parsedValue) && parsedValue > 0
        ? parsedValue
        : defaultSignedUrlExpiresInSeconds;
}

function getRequiredEnv(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is required to create resume signed URLs.`);
    }

    return value;
}

export async function createResumeSignedUrl() {
    const bucket = getRequiredEnv("RESUME_STORAGE_BUCKET");
    const path = getRequiredEnv("RESUME_STORAGE_PATH");

    const { data, error } = await getSupabaseServerClient()
        .storage.from(bucket)
        .createSignedUrl(path, getResumeSignedUrlExpiresIn(), {
            download: true,
        });

    if (error || !data?.signedUrl) {
        throw new Error(error?.message ?? "Unable to create resume signed URL.");
    }

    return data.signedUrl;
}
