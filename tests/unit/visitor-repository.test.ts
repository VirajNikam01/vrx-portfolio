import { PgDialect } from "drizzle-orm/pg-core";
import { getDb } from "@/backend/db/client";
import { visitorsRepository } from "@/backend/repository/visitors";
import { visitors } from "@/backend/db/schema/visitors";

jest.mock("@/backend/db/client", () => ({ getDb: jest.fn() }));

it("initializes first/last seen and increments existing visits atomically without overwriting firstSeenAt", async () => {
    const onConflictDoUpdate = jest.fn().mockResolvedValue(undefined);
    const values = jest.fn().mockReturnValue({ onConflictDoUpdate });
    const insert = jest.fn().mockReturnValue({ values });
    jest.mocked(getDb).mockReturnValue({ insert } as unknown as ReturnType<typeof getDb>);
    const seenAt = new Date("2026-10-31T00:00:00Z");
    await visitorsRepository.upsert({ fingerprintHash: "visitor", language: "en" }, seenAt);
    expect(insert).toHaveBeenCalledWith(visitors);
    expect(values).toHaveBeenCalledWith({ fingerprintHash: "visitor", language: "en", firstSeenAt: seenAt, lastSeenAt: seenAt, visitCount: 1 });
    const update = onConflictDoUpdate.mock.calls[0][0];
    expect(update.target).toBe(visitors.fingerprintHash);
    expect(update.set).toMatchObject({ language: "en", lastSeenAt: seenAt });
    expect(update.set).not.toHaveProperty("firstSeenAt");
    expect(new PgDialect().sqlToQuery(update.set.visitCount).sql).toBe('"visitors"."visit_count" + 1');
});
