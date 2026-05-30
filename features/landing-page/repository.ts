import { and, asc, eq } from "drizzle-orm";

import { landingPageContent } from "@/config/landing-page";
import { getDb } from "@/lib/db/client";
import {
    featureFlagRules,
    featureFlags,
    featureFlagVariants,
    uiPages,
    uiSections,
    type FeatureFlag,
    type FeatureFlagRule,
    type FeatureFlagVariant,
} from "@/lib/db/schema";

import { landingPageContentSchema } from "./schema";
import type { LandingPageContentType } from "./types";

const LANDING_PAGE_KEY = "landing-page";
const PUBLISHED_STATUS = "published";
const FEATURE_FLAG_ENVIRONMENT = process.env.NODE_ENV ?? "production";

export async function readLandingPageContent(): Promise<LandingPageContentType> {
    if (!process.env.DATABASE_URL) {
        return landingPageContent;
    }

    try {
        return await readLandingPageContentFromDatabase();
    } catch {
        return landingPageContent;
    }
}

async function readLandingPageContentFromDatabase() {
    const db = getDb();
    const [page] = await db
        .select()
        .from(uiPages)
        .where(
            and(
                eq(uiPages.key, LANDING_PAGE_KEY),
                eq(uiPages.status, PUBLISHED_STATUS),
            ),
        )
        .limit(1);

    if (!page) {
        return landingPageContent;
    }

    const [sections, flags, rules, variants] = await Promise.all([
        db
            .select()
            .from(uiSections)
            .where(
                and(
                    eq(uiSections.pageId, page.id),
                    eq(uiSections.status, PUBLISHED_STATUS),
                    eq(uiSections.isEnabled, true),
                ),
            )
            .orderBy(asc(uiSections.sortOrder)),
        db.select().from(featureFlags),
        db
            .select()
            .from(featureFlagRules)
            .where(eq(featureFlagRules.isEnabled, true))
            .orderBy(asc(featureFlagRules.priority)),
        db
            .select()
            .from(featureFlagVariants)
            .where(eq(featureFlagVariants.isEnabled, true)),
    ]);

    const sectionContent = new Map(
        sections.map((section) => [section.key, section.content]),
    );

    const content = {
        page: {
            key: page.key,
            path: page.path,
            title: page.title,
        },
        featureFlags: {
            ...landingPageContent.featureFlags,
            ...resolveFeatureFlags(flags, rules, variants),
        },
        sections: sections.map((section) => ({
            key: section.key,
            componentKey: section.componentKey,
            isEnabled: section.isEnabled,
            sortOrder: section.sortOrder,
            props: asRecord(section.props),
            visibilityRules: asRecord(section.visibilityRules),
            designOverrides: asRecord(section.designOverrides),
        })),
        introduction:
            sectionContent.get("introduction") ?? landingPageContent.introduction,
        workExperiences:
            sectionContent.get("workExperience") ??
            landingPageContent.workExperiences,
    };

    return landingPageContentSchema.parse(content);
}

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function isFeatureFlagActive(flag: {
    isEnabled: boolean;
    startsAt: Date | null;
    endsAt: Date | null;
}) {
    const now = Date.now();
    const hasStarted = !flag.startsAt || flag.startsAt.getTime() <= now;
    const hasNotEnded = !flag.endsAt || flag.endsAt.getTime() > now;

    return flag.isEnabled && hasStarted && hasNotEnded;
}

function isRuleActive(rule: FeatureFlagRule) {
    return (
        rule.isEnabled &&
        rule.environment === FEATURE_FLAG_ENVIRONMENT &&
        isFeatureFlagActive(rule)
    );
}

function resolveFeatureFlags(
    flags: FeatureFlag[],
    rules: FeatureFlagRule[],
    variants: FeatureFlagVariant[],
) {
    const variantsByFlagAndKey = new Map(
        variants.map((variant) => [
            `${variant.flagId}:${variant.key}`,
            variant,
        ]),
    );

    return Object.fromEntries(
        flags.map((flag) => {
            const activeRule = rules.find(
                (rule) => rule.flagId === flag.id && isRuleActive(rule),
            );

            return [
                flag.key,
                resolveFeatureFlagState(flag, activeRule, variantsByFlagAndKey),
            ];
        }),
    );
}

function resolveFeatureFlagState(
    flag: FeatureFlag,
    rule: FeatureFlagRule | undefined,
    variantsByFlagAndKey: Map<string, FeatureFlagVariant>,
) {
    if (!isFeatureFlagActive(flag)) {
        return false;
    }

    if (!rule) {
        return true;
    }

    if (rule.rolloutPercentage <= 0 || rule.ruleType === "deny") {
        return false;
    }

    if (rule.ruleType === "allow") {
        return true;
    }

    const variantKey = rule.variantKey ?? flag.defaultVariantKey;
    const variant = variantsByFlagAndKey.get(`${flag.id}:${variantKey}`);
    const payload = asRecord(variant?.payload);

    return payload.isVisible === false ? false : rule.rolloutPercentage > 0;
}
