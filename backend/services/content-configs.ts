import "server-only";
import { contentConfigsRepository } from "@/backend/repository/content_configs";
import type { LandingPageContentType } from "@/shared/contracts/landing-page";
import type { ContentConfig } from "@/backend/db/schema/content-configs";
import { editableFeatureFlags, featureFlagsUpdateSchema, type FeatureFlagsSettings } from "@/shared/contracts/site-settings";
import { AdminError } from "@/backend/errors/admin";

async function readLandingPageContent(): Promise<LandingPageContentType> {
    const record = await contentConfigsRepository.findByKey("landing-page");
    if (!record || !record.content) {
        throw new Error("Landing page content is not configured");
    }
    return record.content as LandingPageContentType;
}

function toFlagsSettings(record: ContentConfig): FeatureFlagsSettings {
    const stored = record.content.featureFlags;
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) throw new AdminError(503, "Homepage feature flags are not configured");
    for (const flag of editableFeatureFlags) {
        const value = (stored as Record<string, unknown>)[flag.key];
        if (value !== undefined && typeof value !== "boolean") throw new AdminError(503, "Homepage feature flags contain an invalid value");
    }
    const flags = Object.fromEntries(editableFeatureFlags.map(flag => [flag.key, (stored as Record<string, unknown>)[flag.key] === true]));
    return featureFlagsUpdateSchema.parse({ flags, version: record.version });
}
async function readAdminFeatureFlags() {
    const record = await contentConfigsRepository.findByKey("landing-page");
    if (!record) throw new AdminError(404, "Homepage settings were not found");
    return toFlagsSettings(record);
}
async function updateAdminFeatureFlags(input: FeatureFlagsSettings) {
    const values = featureFlagsUpdateSchema.parse(input);
    const record = await contentConfigsRepository.updateFeatureFlags(values.version, values.flags);
    if (!record) throw new AdminError(409, "Settings changed in another tab. Reload the latest version before saving.");
    return toFlagsSettings(record);
}
export const contentConfigsService = { readLandingPageContent, readAdminFeatureFlags, updateAdminFeatureFlags };
