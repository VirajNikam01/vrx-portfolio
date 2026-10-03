import { z } from "zod";

import { introductionContentSchema } from "@/features/introduction/schema";
import { workExperiencesSchema } from "@/features/work-experience/schema";
import { recommendationItemSchema } from "@/features/recommendations/schema";
import { skillItemSchema } from "@/features/skills/schema";
import { funProjectItemSchema } from "@/features/fun-projects/schema";

export const landingPageFeatureFlagsSchema = z.object({
    showIntroduction: z.boolean(),
    showWorkExperience: z.boolean(),
    showRecommendations: z.boolean(),
    showBlog: z.boolean().optional(),
    showSkills: z.boolean().optional(),
    showFunProjects: z.boolean().optional(),
});

export const landingPageContentSchema = z.object({
    featureFlags: landingPageFeatureFlagsSchema,
    introduction: introductionContentSchema,
    workExperiences: workExperiencesSchema,
    skills: z.array(skillItemSchema).optional(),
    funProjects: z.array(funProjectItemSchema).optional(),
    recommendations: z.array(recommendationItemSchema).optional(),
});

export const landingPageContentResponseSchema = z.union([
    landingPageContentSchema,
    z.object({
        data: landingPageContentSchema,
    }),
]);
