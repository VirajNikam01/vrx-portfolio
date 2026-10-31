import { z } from "zod";

export const visitorSchema = z.object({
    visitorId: z.string().min(1),
    devicePixelRatio: z.number(),
    screen: z.string().min(1),
    platform: z.string().min(1),
    timezone: z.string().min(1),
    language: z.string().min(1),
    cookiesEnabled: z.boolean(),
    hardwareConcurrency: z.number().int().positive(),
    maxTouchPoints: z.number().int().min(0),
    colorDepth: z.number().int().positive(),
});

export type VisitorPayload = z.infer<typeof visitorSchema>;