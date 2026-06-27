import { NextRequest, NextResponse } from "next/server";
import { visitorsRepository } from "@/features/visitors";

type RouteHandler = (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>;

export const withVisitorTracking = (handler: RouteHandler): RouteHandler =>
    async (req, ...args) => {
        const fingerprintHash = req.headers.get("x-fingerprint");

        if (fingerprintHash) {
            await visitorsRepository.upsert({ fingerprintHash });
        }

        return handler(req, ...args);
    };