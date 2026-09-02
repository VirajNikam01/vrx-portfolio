import { z } from "zod";

import { introductionContentSchema } from "@/features/introduction/schema";
import { workExperiencesSchema } from "@/features/work-experience/schema";
import { recommendationItemSchema } from "@/features/recommendations/schema";

export const landingPageFeatureFlagsSchema = z.object({
    showIntroduction: z.boolean(),
    showWorkExperience: z.boolean(),
    showRecommendations: z.boolean(),
});

export const landingPageContentSchema = z.object({
    featureFlags: landingPageFeatureFlagsSchema,
    introduction: introductionContentSchema,
    workExperiences: workExperiencesSchema,
    recommendations: z.array(recommendationItemSchema).optional(),
});

export const landingPageContentResponseSchema = z.union([
    landingPageContentSchema,
    z.object({
        data: landingPageContentSchema,
    }),
]);
