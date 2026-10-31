import { PgDialect } from "drizzle-orm/pg-core";
import { getDb } from "@/backend/db/client";
import { adminLoginLimitsRepository } from "@/backend/repository/admin_login_limits";
import { adminSessionsRepository } from "@/backend/repository/admin_sessions";
import type { SQL } from "drizzle-orm";

jest.mock("@/backend/db/client", () => ({ getDb: jest.fn() }));

it("reserves login attempts atomically with serializable timestamp parameters", async () => {
    const returning = jest.fn().mockResolvedValue([{ attempts: 1 }]);
    const onConflictDoUpdate = jest.fn().mockReturnValue({ returning });
    const values = jest.fn().mockReturnValue({ onConflictDoUpdate });
    const insert = jest.fn().mockReturnValue({ values });
    jest.mocked(getDb).mockReturnValue({ insert } as unknown as ReturnType<typeof getDb>);
    const now = new Date();
    await adminLoginLimitsRepository.reserve("hashed-key", now, new Date(now.getTime() + 900000));
    const update = onConflictDoUpdate.mock.calls[0][0];
    for (const expression of Object.values(update.set) as SQL[]) {
        const query = new PgDialect().sqlToQuery(expression);
        expect(query.sql).toContain("case when");
        expect(query.params.every(param => typeof param === "string")).toBe(true);
    }
});

it("requires an unexpired session with the matching credential version", async () => {
    const limit = jest.fn().mockResolvedValue([]);
    const where = jest.fn().mockReturnValue({ limit });
    const from = jest.fn().mockReturnValue({ where });
    const select = jest.fn().mockReturnValue({ from });
    jest.mocked(getDb).mockReturnValue({ select } as unknown as ReturnType<typeof getDb>);
    await expect(adminSessionsRepository.find("token-hash", "version", new Date())).resolves.toBeNull();
    const predicate = new PgDialect().sqlToQuery(where.mock.calls[0][0]);
    expect(predicate.sql).toContain('"expires_at" >');
    expect(predicate.params.slice(0, 2)).toEqual(["token-hash", "version"]);
});
