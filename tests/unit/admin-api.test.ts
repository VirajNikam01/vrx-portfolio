/** @jest-environment node */
import { GET as list, POST as create } from "@/app/api/admin/bookshelf/route";
import { GET as read, PATCH as update } from "@/app/api/admin/bookshelf/[id]/route";
import { GET as topics, POST as createTopic } from "@/app/api/admin/bookshelf/[id]/topics/route";
import { GET as readTopic, PATCH as updateTopic } from "@/app/api/admin/bookshelf/[id]/topics/[topicId]/route";
import { GET as readFlags, PATCH as updateFlags } from "@/app/api/admin/settings/feature-flags/route";
import { adminSessionsService } from "@/backend/services/admin-sessions";
import { recommendationsService } from "@/backend/services/recommendations";
import { bookshelfAdminService } from "@/backend/services/bookshelf-admin";
import { AdminError } from "@/backend/errors/admin";

jest.mock("next/headers", () => ({ cookies: async () => ({ get: () => ({ value: "a".repeat(64) }) }) }));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("@/backend/services/admin-sessions", () => ({ adminSessionsService: { validate: jest.fn() } }));
jest.mock("@/backend/services/recommendations", () => ({ recommendationsService: { readAdminItems: jest.fn(), createAdminItem: jest.fn(), readAdminItem: jest.fn() } }));
jest.mock("@/backend/services/recommendation-topics", () => ({ recommendationTopicsService: { readAdminTopics: jest.fn(), readAdminTopic: jest.fn() } }));
jest.mock("@/backend/services/bookshelf-admin", () => ({ bookshelfAdminService: { updateItem: jest.fn(), saveTopic: jest.fn() } }));
const input = { type: "book", title: "A book", author: "Author", slug: "a-book", description: "Description", category: "tech", coverImageUrl: "", externalUrl: "", notes: "", tags: [], sortOrder: 0, isFeatured: false, isVisible: false, version: 0 };
const context = { params: Promise.resolve({ id: "1", topicId: "2" }) };
function request(method = "GET", body: unknown = input, origin = "http://localhost") { return new Request("http://localhost/api/admin/bookshelf", { method, headers: { Origin: origin, "Content-Type": "application/json", "x-admin-request": "1" }, ...(method !== "GET" ? { body: JSON.stringify(body) } : {}) }); }
beforeEach(() => jest.resetAllMocks());

it("protects every item and topic endpoint from unauthenticated reads and writes", async () => {
    jest.mocked(adminSessionsService.validate).mockResolvedValue(null);
    const responses = await Promise.all([list(request()), create(request("POST")), read(request(), context), update(request("PATCH"), context), topics(request(), context), createTopic(request("POST"), context), readTopic(request(), context), updateTopic(request("PATCH"), context), readFlags(request()), updateFlags(request("PATCH"))]);
    expect(responses.every(response => response.status === 401)).toBe(true);
    expect(recommendationsService.readAdminItems).not.toHaveBeenCalled();
    expect(recommendationsService.createAdminItem).not.toHaveBeenCalled();
    expect(bookshelfAdminService.saveTopic).not.toHaveBeenCalled();
});

it("rejects cross-origin mutations before they reach content services", async () => {
    const response = await create(request("POST", input, "https://evil.example"));
    expect(response.status).toBe(403);
    expect(recommendationsService.createAdminItem).not.toHaveBeenCalled();
});

it("validates input and keeps private responses uncacheable", async () => {
    jest.mocked(adminSessionsService.validate).mockResolvedValue({ email: "owner@example.com", expiresAt: new Date().toISOString() });
    const invalid = await create(request("POST", { ...input, externalUrl: "javascript:alert(1)" }));
    expect(invalid.status).toBe(422);
    expect((await invalid.json()).fields).toHaveProperty("externalUrl");
    expect(invalid.headers.get("Cache-Control")).toContain("no-store");
    expect(invalid.headers.get("X-Robots-Tag")).toContain("noindex");
});

it("preserves conflict errors and hides database failure details", async () => {
    const log = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.mocked(adminSessionsService.validate).mockResolvedValue({ email: "owner@example.com", expiresAt: new Date().toISOString() });
    jest.mocked(bookshelfAdminService.updateItem).mockRejectedValueOnce(new AdminError(409, "Stale edit")).mockRejectedValueOnce(new Error("private database connection string"));
    expect((await update(request("PATCH"), context)).status).toBe(409);
    const failed = await update(request("PATCH"), context);
    expect(failed.status).toBe(503);
    expect(JSON.stringify(await failed.json())).not.toContain("connection string");
    log.mockRestore();
});
