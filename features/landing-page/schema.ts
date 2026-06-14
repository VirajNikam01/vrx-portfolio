import { z } from "zod";

import { introductionContentSchema } from "@/features/introduction/schema";
import { workExperiencesSchema } from "@/features/work-experience/schema";

export const landingPageFeatureFlagsSchema = z.object({
    showIntroduction: z.boolean(),
    showWorkExperience: z.boolean(),
});

export const landingPageContentSchema = z.object({
    featureFlags: landingPageFeatureFlagsSchema,
    introduction: introductionContentSchema,
    workExperiences: workExperiencesSchema,
});

export const landingPageContentResponseSchema = z.union([
    landingPageContentSchema,
    z.object({
        data: landingPageContentSchema,
    }),
]);
