import { getLandingPageContent } from "@/features/landing-page/api";
import { landingPageContent } from "@/config/landing-page";
import { httpClient } from "@/lib/api/http-client";

jest.mock("@/lib/api/http-client", () => ({
  httpClient: {
    get: jest.fn(),
  },
}));

const mockedGet = jest.mocked(httpClient.get);

describe("content API adapters", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("unwraps landing page content returned inside a data envelope", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: landingPageContent } });

    await expect(getLandingPageContent()).resolves.toEqual(landingPageContent);
    expect(mockedGet).toHaveBeenCalledWith("/content/landing-page");
  });

  it("falls back to configured landing page content when the request fails", async () => {
    mockedGet.mockRejectedValueOnce(new Error("offline"));

    await expect(getLandingPageContent()).resolves.toEqual(landingPageContent);
  });

  it("falls back to configured landing page content when remote validation fails", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: { page: "invalid" } } });

    await expect(getLandingPageContent()).resolves.toEqual(landingPageContent);
  });
});
