import "server-only";

import { resolveMx } from "node:dns/promises";

import { disposableEmailDomains } from "./disposable-email-domains";

const disposableEmailDomainSet = new Set<string>(disposableEmailDomains);

function getEmailDomain(email: string) {
    return email.trim().toLowerCase().split("@").at(1) ?? "";
}

export function isDisposableEmailDomain(domain: string) {
    const normalizedDomain = domain.trim().toLowerCase();

    return (
        disposableEmailDomainSet.has(normalizedDomain) ||
        disposableEmailDomains.some((blockedDomain) =>
            normalizedDomain.endsWith(`.${blockedDomain}`),
        )
    );
}

export async function validateInquiryEmail(email: string) {
    const domain = getEmailDomain(email);

    if (!domain || isDisposableEmailDomain(domain)) {
        return {
            valid: false,
            message: "Please use a non-temporary email address.",
        };
    }

    try {
        const mxRecords = await resolveMx(domain);

        if (mxRecords.length === 0) {
            return {
                valid: false,
                message: "Please use an email address that can receive mail.",
            };
        }
    } catch {
        return {
            valid: false,
            message: "Please use an email address that can receive mail.",
        };
    }

    return { valid: true };
}
