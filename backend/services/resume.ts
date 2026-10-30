import "server-only";
import { createResumeSignedUrl } from "@/backend/integrations/storage/resume";

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


async function createSignedUrl() {
    return createResumeSignedUrl(getResumeSignedUrlExpiresIn());
}

export const resumeService = { createSignedUrl };
