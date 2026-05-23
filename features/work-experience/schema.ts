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
    startDate: z.iso.date(),
    endDate: z.iso.date().optional(),
    employmentPeriod: z.string(),
    employmentType: z.string().optional(),
    description: z.array(z.string().min(1)).optional(),
    icon: experiencePositionIconSchema.optional(),
    skills: z.array(z.string()).optional(),
    countsTowardExperience: z.boolean().optional(),
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
