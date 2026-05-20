import { z } from "zod";

const experiencePositionIconSchema = z.enum([
    "code",
    "design",
    "business",
    "education",
]);

const experiencePositionSchema = z.object({
    id: z.string(),
    title: z.string(),
    employmentPeriod: z.string(),
    employmentType: z.string().optional(),
    description: z.string().optional(),
    icon: experiencePositionIconSchema.optional(),
    skills: z.array(z.string()).optional(),
    isExpanded: z.boolean().optional(),
});

export const workExperienceSchema = z.object({
    id: z.string(),
    companyName: z.string(),
    companyLogo: z.string().optional(),
    positions: z.array(experiencePositionSchema),
    isCurrentEmployer: z.boolean().optional(),
});

export const workExperiencesSchema = z.array(workExperienceSchema);

export const workExperiencesResponseSchema = z.union([
    workExperiencesSchema,
    z.object({
        data: workExperiencesSchema,
    }),
]);
