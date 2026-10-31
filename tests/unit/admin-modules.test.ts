/** @jest-environment node */
import { PgDialect } from "drizzle-orm/pg-core";
import { getDb } from "@/backend/db/client";
import { contentConfigsRepository } from "@/backend/repository/content_configs";
import { contentConfigsService } from "@/backend/services/content-configs";
import { adminModules, isAdminDestination } from "@/config/admin-modules";
import { safeAdminReturn } from "@/shared/contracts/admin";
import type { ContentConfig } from "@/backend/db/schema/content-configs";

jest.mock("@/backend/db/client", () => ({ getDb: jest.fn() }));
const flags = { showIntroduction: true, showBlog: false, showSkills: true, showWorkExperience: true, showFunProjects: false };
const row: ContentConfig = { id: 1, key: "landing-page", content: { featureFlags: { ...flags, showRecommendations: false, futureFlag: true }, introduction: { headline: "Preserve this" }, meta: { email: "owner@example.com" } }, config: {}, isActive: true, version: 3, createdAt: new Date(), updatedAt: new Date() };
afterEach(() => jest.restoreAllMocks());

it("registers independent modules and only accepts registered local destinations", () => {
    expect(adminModules.map(module => module.id)).toEqual(["bookshelf", "feature-flags"]);
    expect(isAdminDestination("/admin/settings/feature-flags")).toBe(true);
    expect(safeAdminReturn("/admin/bookshelf/1/edit")).toBe("/admin/bookshelf/1/edit");
    for (const value of ["//evil.example", "/admin/unknown", "/admin/bookshelf/../../login", "/admin\\bookshelf", "https://evil.example/admin"]) expect(isAdminDestination(value)).toBe(false);
});

it("projects only editable feature flags, preserving legacy and other config values", async () => {
    jest.spyOn(contentConfigsRepository, "findByKey").mockResolvedValue(row);
    const settings = await contentConfigsService.readAdminFeatureFlags();
    expect(settings).toEqual({ flags, version: 3 });
    expect(row.content).toHaveProperty("introduction.headline", "Preserve this");
    expect(settings.flags).not.toHaveProperty("futureFlag");
});

it("rejects stale writes, unknown flag keys, and missing database settings", async () => {
    jest.spyOn(contentConfigsRepository, "updateFeatureFlags").mockResolvedValue(null);
    await expect(contentConfigsService.updateAdminFeatureFlags({ flags, version: 0 })).rejects.toMatchObject({ status: 409 });
    await expect(contentConfigsService.updateAdminFeatureFlags({ flags: { ...flags, showRecommendations: true }, version: 3 } as never)).rejects.toThrow();
    jest.spyOn(contentConfigsRepository, "findByKey").mockResolvedValue(null);
    await expect(contentConfigsService.readAdminFeatureFlags()).rejects.toMatchObject({ status: 404 });
});

it("updates JSON flags with an atomic nested merge and a version predicate", async () => {
    const returning = jest.fn().mockResolvedValue([{ ...row, version: 4 }]);
    const where = jest.fn().mockReturnValue({ returning });
    const set = jest.fn().mockReturnValue({ where });
    const update = jest.fn().mockReturnValue({ set });
    jest.mocked(getDb).mockReturnValue({ update } as unknown as ReturnType<typeof getDb>);
    await contentConfigsRepository.updateFeatureFlags(3, flags);
    const dialect = new PgDialect();
    const assignment = dialect.sqlToQuery(set.mock.calls[0][0].content);
    expect(assignment.sql).toContain("jsonb_set");
    expect(assignment.sql).toContain("||");
    expect(assignment.params).toEqual([JSON.stringify(flags)]);
    const predicate = dialect.sqlToQuery(where.mock.calls[0][0]);
    expect(predicate.params).toEqual(["landing-page", 3]);
    expect(predicate.sql).toContain("jsonb_typeof");
});
