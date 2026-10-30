import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { visitorsService } from "@/backend/services/visitors";

type RouteHandler = (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>;

export const withVisitorTracking = (handler: RouteHandler): RouteHandler =>
    async (req, ...args) => {
        const fingerprintHash = req.headers.get("x-fingerprint");

        if (fingerprintHash) {
            await visitorsService.ensureVisitor(fingerprintHash);
        }

        return handler(req, ...args);
    };
