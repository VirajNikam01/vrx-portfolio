import { z } from "zod";

const experiencePositionIconSchema = z.enum([
    "code",
    "design",
    "business",
    "education",
]);

const experiencePositionCategorySchema = z.enum([
    "professional",
    "education",
    "learning",
]);

const experiencePositionSchema = z.object({
    id: z.string(),
    title: z.string(),
    category: experiencePositionCategorySchema,
    startDate: z.iso.date(),
    endDate: z.iso.date().optional(),
    employmentType: z.string().optional(),
    description: z.array(z.string().min(1)).optional(),
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
