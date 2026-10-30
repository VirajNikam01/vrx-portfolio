import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { visitorSchema } from "@/shared/contracts/visitors-schema";
import { visitorsService } from "@/backend/services/visitors";

export async function POST(request: NextRequest) {
    const payload = await request.json();
    const parsed = visitorSchema.safeParse(payload);
    if (!parsed.success) {
        return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 422 });
    }
    await visitorsService.recordVisit(parsed.data, {
        ip: request.headers.get("x-forwarded-for")?.split(",")[0] ?? null,
        userAgent: request.headers.get("user-agent") ?? null,
        country: request.headers.get("x-vercel-ip-country") ?? null,
        region: request.headers.get("x-vercel-ip-country-region") ?? null,
        city: request.headers.get("x-vercel-ip-city") ?? null,
    });
    return NextResponse.json({ success: true }, { status: 200 });
}
