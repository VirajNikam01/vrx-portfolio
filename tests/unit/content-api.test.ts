import { getIntroductionContent } from "@/features/introduction/api";
import { getWorkExperiences } from "@/features/work-experience/api";
import { introductionContent } from "@/config/introduction";
import { workExperiences } from "@/config/work-experience";
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

  it("unwraps introduction content returned inside a data envelope", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: introductionContent } });

    await expect(getIntroductionContent()).resolves.toEqual(introductionContent);
    expect(mockedGet).toHaveBeenCalledWith("/introduction");
  });

  it("falls back to configured introduction content when the request fails", async () => {
    mockedGet.mockRejectedValueOnce(new Error("offline"));

    await expect(getIntroductionContent()).resolves.toEqual(introductionContent);
  });

  it("unwraps work experiences returned inside a data envelope", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: workExperiences } });

    await expect(getWorkExperiences()).resolves.toEqual(workExperiences);
    expect(mockedGet).toHaveBeenCalledWith("/work-experience");
  });

  it("falls back to configured work experiences when remote payload validation fails", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: [{ id: "invalid" }] } });

    await expect(getWorkExperiences()).resolves.toEqual(workExperiences);
  });
});
