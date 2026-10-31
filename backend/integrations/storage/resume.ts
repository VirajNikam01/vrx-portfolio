import "server-only";

import { getSupabaseServerClient } from "@/backend/integrations/storage/supabase";

function getRequiredEnv(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is required to create resume signed URLs.`);
    }

    return value;
}

export async function createResumeSignedUrl(expiresIn: number) {
    const bucket = getRequiredEnv("RESUME_STORAGE_BUCKET");
    const path = getRequiredEnv("RESUME_STORAGE_PATH");

    console.log("Creating resume signed URL with bucket:", bucket, "and path:", path);

    const { data, error } = await getSupabaseServerClient()
        .storage.from(bucket)
        .createSignedUrl(path, expiresIn, {
            download: true,
        });

    console.log(data)
    console.log(error)

    if (error || !data?.signedUrl) {
        throw new Error(error?.message ?? "Unable to create resume signed URL.");
    }

    return data.signedUrl;
}
