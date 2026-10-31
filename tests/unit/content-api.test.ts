import { landingPageContent } from "@/config/landing-page";
import { introductionContent } from "@/config/introduction";
import { workExperiences } from "@/config/work-experience";
import { getLandingPageContent } from "@/lib/api/landing-page";
import { getIntroductionContent } from "@/lib/api/introduction";
import { getWorkExperiences } from "@/lib/api/work-experience";
import { apiClient } from "@/lib/api/client";
import { landingPageApi } from "@/lib/api/landing-page";

jest.mock("@/lib/api/client", () => ({ apiClient: { get: jest.fn() } }));

beforeEach(() => jest.resetAllMocks());

describe("content adapters", () => {
    it("returns landing page content retrieved from the API", async () => {
        jest.mocked(apiClient.get).mockResolvedValue({ status: 200, data: { data: landingPageContent } });
        await expect(getLandingPageContent()).resolves.toEqual(
            landingPageContent,
        );
    });

    it("propagates API failures without returning default content", async () => {
        jest.mocked(apiClient.get).mockRejectedValue(new Error("offline"));
        await expect(landingPageApi.fetchLandingPageContent()).rejects.toThrow("offline");
        await expect(getLandingPageContent()).rejects.toThrow("offline");
    });

    it.each([
        { status: 200, data: null },
        { status: 200, data: { error: "unavailable" } },
        { status: 503, data: { data: landingPageContent } },
    ])("rejects unsuccessful or missing content responses: %j", async (response) => {
        jest.mocked(apiClient.get).mockResolvedValue(response);
        await expect(landingPageApi.fetchLandingPageContent()).rejects.toThrow("unavailable");
    });

    it("returns the local introduction content", async () => {
        await expect(getIntroductionContent()).resolves.toEqual(
            introductionContent,
        );
    });

    it("returns the local work experience content", async () => {
        await expect(getWorkExperiences()).resolves.toEqual(workExperiences);
    });
});
