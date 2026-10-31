import { PgDialect } from "drizzle-orm/pg-core";
import type { SQL } from "drizzle-orm";
import { getDb } from "@/backend/db/client";
import { recommendationsRepository } from "@/backend/repository/recommendations";

jest.mock("@/backend/db/client", () => ({ getDb: jest.fn() }));

it("filters public catalog rows in SQL, omits full notes, and orders ties by stable ID", async () => {
    const orderBy = jest.fn().mockResolvedValue([]);
    const where = jest.fn().mockReturnValue({ orderBy });
    const from = jest.fn().mockReturnValue({ where });
    const select = jest.fn().mockReturnValue({ from });
    jest.mocked(getDb).mockReturnValue({ select } as unknown as ReturnType<typeof getDb>);
    await recommendationsRepository.findBookshelfCatalog();
    const fields = select.mock.calls[0][0];
    expect(fields).toHaveProperty("tags");
    expect(fields).not.toHaveProperty("notes");
    expect(fields).not.toHaveProperty("externalUrl");
    const dialect = new PgDialect();
    const predicate = dialect.sqlToQuery(where.mock.calls[0][0]);
    expect(predicate.sql).toContain('"is_visible" = $1');
    expect(predicate.params).toEqual([true]);
    expect(orderBy.mock.calls[0].map((column: SQL) => dialect.sqlToQuery(column).sql)).toEqual([
        '"recommendations"."sort_order" asc', '"recommendations"."id" asc',
    ]);
});
