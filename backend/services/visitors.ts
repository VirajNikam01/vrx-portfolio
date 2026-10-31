import "server-only";
import { visitorsRepository } from "@/backend/repository/visitors";
import type { VisitorPayload } from "@/shared/contracts/visitors-schema";

type VisitorContext = {
    ip: string | null;
    userAgent: string | null;
    country: string | null;
    region: string | null;
    city: string | null;
};

async function ensureVisitor(fingerprintHash: string) {
    await visitorsRepository.upsert({ fingerprintHash }, new Date());
}

async function recordVisit(payload: VisitorPayload, context: VisitorContext) {
    const { visitorId, ...attributes } = payload;
    await visitorsRepository.upsert({ ...attributes, ...context, fingerprintHash: visitorId }, new Date());
}

export const visitorsService = { ensureVisitor, recordVisit };
