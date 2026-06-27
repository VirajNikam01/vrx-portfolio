import { NextRequest, NextResponse } from "next/server";
import { visitorsRepository } from "@/features/visitors";
import { visitorSchema } from "@/features/visitors/schema";

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    const parsed = visitorSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { success: false, errors: parsed.error.flatten().fieldErrors },
            { status: 422 }
        );
    }

    const { visitorId, ...rest } = parsed.data;

    await visitorsRepository.upsert({
        ...rest,
        fingerprintHash: visitorId,
        ip: req.headers.get("x-forwarded-for")?.split(",")[0] ?? null,
        userAgent: req.headers.get("user-agent") ?? null,
        // country/region/city come from Vercel's geo headers automatically
        country: req.headers.get("x-vercel-ip-country") ?? null,
        region: req.headers.get("x-vercel-ip-country-region") ?? null,
        city: req.headers.get("x-vercel-ip-city") ?? null,
    });

    return NextResponse.json({ success: true }, { status: 200 });
};