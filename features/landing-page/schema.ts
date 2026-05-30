import { z } from "zod";

import { introductionContentSchema } from "@/features/introduction/schema";
import { workExperiencesSchema } from "@/features/work-experience/schema";

export const landingPageFeatureFlagsSchema = z.object({
    showIntroduction: z.boolean(),
    showWorkExperience: z.boolean(),
});

const landingPageFeatureFlagKeys = [
    "showIntroduction",
    "showWorkExperience",
] as const;

export const landingPageSectionSchema = z.object({
    key: z.enum(["introduction", "workExperience"]),
    componentKey: z.string().min(1),
    isEnabled: z.boolean(),
    sortOrder: z.number().int(),
    props: z.record(z.string(), z.unknown()).default({}),
    visibilityRules: z
        .object({
            featureFlagKey: z.enum(landingPageFeatureFlagKeys).optional(),
        })
        .default({}),
    designOverrides: z.record(z.string(), z.unknown()).default({}),
});

export const landingPageContentSchema = z.object({
    page: z.object({
        key: z.string().min(1),
        path: z.string().min(1),
        title: z.string().min(1),
    }),
    featureFlags: landingPageFeatureFlagsSchema,
    sections: z.array(landingPageSectionSchema),
    introduction: introductionContentSchema,
    workExperiences: workExperiencesSchema,
});

export const landingPageContentResponseSchema = z.union([
    landingPageContentSchema,
    z.object({
        data: landingPageContentSchema,
    }),
]);
