import { z } from "zod";
import { isAdminDestination } from "@/config/admin-modules";

export const adminLoginSchema = z.object({ email: z.string().trim().toLowerCase().email().max(254), password: z.string().min(1).max(1024) }).strict();
export function safeAdminReturn(value: string | null) {
    return value && isAdminDestination(value) ? value : "/admin";
}
