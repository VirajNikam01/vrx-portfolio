import { eq } from "drizzle-orm";
import { loadEnvConfig } from "@next/env";

import { getDb } from "./client";
import {
    featureFlags,
    featureFlagRules,
    featureFlagVariants,
    designConfigs,
    uiPages,
    uiSections,
    type NewDesignConfig,
    type NewFeatureFlag,
    type NewFeatureFlagRule,
    type NewFeatureFlagVariant,
    type NewUiPage,
    type NewUiSection,
} from "./schema";
import { landingPageSeedData } from "./seed-data/landing-page";

loadEnvConfig(process.cwd());

export async function seedCurrentUiContent() {
    const db = getDb();

    const [page] = await db
        .insert(uiPages)
        .values(landingPageSeedData.page satisfies NewUiPage)
        .onConflictDoUpdate({
            target: uiPages.key,
            set: {
                path: landingPageSeedData.page.path,
                title: landingPageSeedData.page.title,
                status: landingPageSeedData.page.status,
                publishedAt: landingPageSeedData.page.publishedAt,
                updatedAt: new Date(),
            },
        })
        .returning();

    await Promise.all(
        landingPageSeedData.sections.map((section) => {
            const values = {
                ...section,
                pageId: page.id,
            } satisfies NewUiSection;

            return db
                .insert(uiSections)
                .values(values)
                .onConflictDoUpdate({
                    target: [uiSections.pageId, uiSections.key],
                    set: {
                        componentKey: section.componentKey,
                        title: section.title,
                        status: section.status,
                        isEnabled: section.isEnabled,
                        sortOrder: section.sortOrder,
                        props: section.props,
                        content: section.content,
                        dataSource: section.dataSource,
                        visibilityRules: section.visibilityRules,
                        designOverrides: section.designOverrides,
                        metadata: section.metadata,
                        publishedAt: section.publishedAt,
                        updatedAt: new Date(),
                    },
                });
        }),
    );

    await Promise.all(
        landingPageSeedData.featureFlags.map((flag) =>
            db
                .insert(featureFlags)
                .values(flag satisfies NewFeatureFlag)
                .onConflictDoUpdate({
                    target: featureFlags.key,
                    set: {
                        name: flag.name,
                        description: flag.description,
                        isEnabled: flag.isEnabled,
                        defaultVariantKey: flag.defaultVariantKey,
                        owner: flag.owner,
                        metadata: flag.metadata,
                        updatedAt: new Date(),
                    },
                })
                .returning(),
        ),
    );

    const savedFlags = await db.select().from(featureFlags);
    const flagIdByKey = new Map(savedFlags.map((flag) => [flag.key, flag.id]));

    await Promise.all(
        landingPageSeedData.featureFlagVariants.map((variant) => {
            const flagId = flagIdByKey.get(variant.flagKey);

            if (!flagId) {
                throw new Error(`Missing feature flag for ${variant.flagKey}`);
            }

            const values = {
                flagId,
                key: variant.key,
                name: variant.name,
                isEnabled: variant.isEnabled,
                weight: variant.weight,
                payload: variant.payload,
                sortOrder: variant.sortOrder,
            } satisfies NewFeatureFlagVariant;

            return db
                .insert(featureFlagVariants)
                .values(values)
                .onConflictDoUpdate({
                    target: [featureFlagVariants.flagId, featureFlagVariants.key],
                    set: {
                        name: variant.name,
                        isEnabled: variant.isEnabled,
                        weight: variant.weight,
                        payload: variant.payload,
                        sortOrder: variant.sortOrder,
                        updatedAt: new Date(),
                    },
                });
        }),
    );

    await Promise.all(
        landingPageSeedData.featureFlagRules.map((rule) => {
            const flagId = flagIdByKey.get(rule.flagKey);

            if (!flagId) {
                throw new Error(`Missing feature flag for ${rule.flagKey}`);
            }

            const values = {
                flagId,
                key: rule.key,
                environment: rule.environment,
                ruleType: rule.ruleType,
                variantKey: rule.variantKey,
                priority: rule.priority,
                isEnabled: rule.isEnabled,
                rolloutPercentage: rule.rolloutPercentage,
                conditions: rule.conditions,
                metadata: rule.metadata,
            } satisfies NewFeatureFlagRule;

            return db
                .insert(featureFlagRules)
                .values(values)
                .onConflictDoUpdate({
                    target: [featureFlagRules.flagId, featureFlagRules.key],
                    set: {
                        environment: rule.environment,
                        ruleType: rule.ruleType,
                        variantKey: rule.variantKey,
                        priority: rule.priority,
                        isEnabled: rule.isEnabled,
                        rolloutPercentage: rule.rolloutPercentage,
                        conditions: rule.conditions,
                        metadata: rule.metadata,
                        updatedAt: new Date(),
                    },
                });
        }),
    );

    await Promise.all(
        landingPageSeedData.designConfigs.map((config) =>
            db
                .insert(designConfigs)
                .values(config satisfies NewDesignConfig)
                .onConflictDoUpdate({
                    target: [designConfigs.scope, designConfigs.key],
                    set: {
                        name: config.name,
                        isActive: config.isActive,
                        schemaVersion: config.schemaVersion,
                        tokens: config.tokens,
                        componentVariants: config.componentVariants,
                        metadata: config.metadata,
                        updatedAt: new Date(),
                    },
                }),
        ),
    );

    return db
        .select()
        .from(uiPages)
        .where(eq(uiPages.key, landingPageSeedData.page.key));
}

if (require.main === module) {
    seedCurrentUiContent()
        .then(() => {
            console.log("Seeded current UI content.");
            process.exit(0);
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
