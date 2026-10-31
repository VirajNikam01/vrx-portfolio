import { z } from "zod";
import { bookshelfTypes } from "./bookshelf";

const slug = z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens");
const optionalUrl = (cover: boolean) => z.string().trim().max(2000).refine(value => {
    if (!value) return true;
    if (cover && /^\/images\/[a-zA-Z0-9/_%.-]+$/.test(value) && !value.includes("..") && !/%(?:2e|2f|5c)/i.test(value)) return true;
    try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}, "Enter a valid HTTP(S) URL");

export const adminItemSchema = z.object({
    type: z.enum(bookshelfTypes), title: z.string().trim().min(1).max(250), author: z.string().trim().min(1).max(250),
    slug, description: z.string().trim().min(1).max(2000), category: z.enum(["tech", "philosophy", "other"]),
    coverImageUrl: optionalUrl(true), externalUrl: optionalUrl(false), notes: z.string().max(100000),
    tags: z.array(z.string().trim().min(1).max(40)).max(20).transform(tags => [...new Set(tags.map(tag => tag.toLowerCase()))]),
    sortOrder: z.number().int().min(0).max(2147483646), isFeatured: z.boolean(), isVisible: z.boolean(),
    version: z.number().int().min(0).optional(),
}).strict().refine(value => value.type !== "note" || !value.isVisible || Boolean(value.notes.trim()), { path: ["notes"], message: "Write your note before publishing" });

export const adminTopicSchema = z.object({
    title: z.string().trim().min(1).max(250), slug, content: z.string().max(100000),
    sortOrder: z.number().int().min(0).max(2147483646), isPublished: z.boolean(), version: z.number().int().min(0).optional(),
}).strict().refine(value => !value.isPublished || Boolean(value.content.trim()), { path: ["content"], message: "Write some notes before publishing" });

export type AdminItemInput = z.infer<typeof adminItemSchema>;
export type AdminTopicInput = z.infer<typeof adminTopicSchema>;
export type AdminItem = Omit<AdminItemInput, "version"> & { id: number; version: number; slugLocked: boolean; updatedAt: string };
export type AdminTopic = Omit<AdminTopicInput, "version"> & { id: number; recommendationId: number; version: number; slugLocked: boolean; updatedAt: string };

export function suggestSlug(title: string) {
    return title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120).replace(/-+$/, "");
}

