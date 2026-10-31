/** @jest-environment node */
import { GET as catalog } from "@/app/api/bookshelf/route";
import { GET as detail } from "@/app/api/bookshelf/[slug]/route";
import { recommendationsService } from "@/backend/services/recommendations";

jest.mock("@/backend/services/recommendations", () => ({ recommendationsService: { readBookshelfCatalog: jest.fn(), readBookshelfItem: jest.fn() } }));
beforeEach(() => jest.resetAllMocks());

it("distinguishes empty catalog, not-found items, and database failures", async () => {
    jest.mocked(recommendationsService.readBookshelfCatalog).mockResolvedValueOnce([]).mockRejectedValueOnce(new Error("secret database details"));
    const empty = await catalog();
    expect(empty.status).toBe(200);
    expect(await empty.json()).toEqual({ data: [] });
    const failed = await catalog();
    expect(failed.status).toBe(503);
    expect(failed.headers.get("Cache-Control")).toBe("no-store");
    expect(await failed.json()).toEqual({ error: "Bookshelf is temporarily unavailable" });
    jest.mocked(recommendationsService.readBookshelfItem).mockResolvedValueOnce(null).mockRejectedValueOnce(new Error("offline"));
    const request = new Request("http://localhost/api/bookshelf/hidden");
    const context = { params: Promise.resolve({ slug: "hidden" }) };
    expect((await detail(request, context)).status).toBe(404);
    expect((await detail(request, context)).status).toBe(503);
});
