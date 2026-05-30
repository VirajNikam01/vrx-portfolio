import { getLandingPageContent } from "@/features/landing-page/api";
import { landingPageContent } from "@/config/landing-page";
import { getIntroductionContent } from "@/features/introduction/api";
import { introductionContent } from "@/config/introduction";
import { getWorkExperiences } from "@/features/work-experience/api";
import { workExperiences } from "@/config/work-experience";
import { httpClient } from "@/lib/api/http-client";

jest.mock("@/lib/api/http-client", () => ({
  httpClient: {
    defaults: {
      baseURL: "/api",
    },
    get: jest.fn(),
  },
}));

const mockedGet = jest.mocked(httpClient.get);

describe("content API adapters", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("uses the Next API route namespace by default", () => {
    expect(httpClient.defaults.baseURL).toBe("/api");
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

  it("fetches introduction content from its dedicated endpoint", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: introductionContent } });

    await expect(getIntroductionContent()).resolves.toEqual(introductionContent);
    expect(mockedGet).toHaveBeenCalledWith("/content/introduction");
  });

  it("falls back to configured introduction content when the request fails", async () => {
    mockedGet.mockRejectedValueOnce(new Error("offline"));

    await expect(getIntroductionContent()).resolves.toEqual(introductionContent);
  });

  it("fetches work experiences from its dedicated endpoint", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: workExperiences } });

    await expect(getWorkExperiences()).resolves.toEqual(workExperiences);
    expect(mockedGet).toHaveBeenCalledWith("/content/work-experience");
  });

  it("falls back to configured work experiences when remote validation fails", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: [{ id: "invalid" }] } });

    await expect(getWorkExperiences()).resolves.toEqual(workExperiences);
  });
});
