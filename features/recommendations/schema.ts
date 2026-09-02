import { z } from "zod";

export const recommendationTypeSchema = z.enum(["book", "course"]);
export const recommendationCategorySchema = z.enum([
    "tech",
    "philosophy",
    "other",
]);

export const recommendationItemSchema = z.object({
    id: z.number(),
    slug: z.string(),
    type: recommendationTypeSchema,
    category: recommendationCategorySchema,
    title: z.string(),
    author: z.string(),
    description: z.string(),
    coverImageUrl: z.string().nullable(),
    externalUrl: z.string().nullable(),
    notes: z.string().nullable(),
    isFeatured: z.boolean(),
    isVisible: z.boolean(),
    sortOrder: z.number(),
});

export const recommendationsResponseSchema = z.object({
    data: z.array(recommendationItemSchema),
});

export const recommendationDetailResponseSchema = z.object({
    data: recommendationItemSchema,
});
