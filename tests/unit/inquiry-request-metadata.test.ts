import { collectInquiryRequestMetadata } from "@/app/api/inquiries/request-metadata";

function createRequest(headers: Record<string, string>) {
  return {
    headers: new Headers(headers),
  } as Request;
}

describe("inquiry request metadata", () => {
  it("collects useful request metadata without storing IP data", () => {
    expect(
      collectInquiryRequestMetadata(
        createRequest({
          "user-agent": "Mozilla/5.0 Test Browser",
          referer: "https://virajnikam.in/",
          "accept-language": "en-US,en;q=0.9",
          "x-vercel-ip-country": "IN",
          "x-vercel-ip-country-region": "MH",
          "x-vercel-ip-city": "Mumbai",
          "x-vercel-ip-timezone": "Asia/Kolkata",
        }),
      ),
    ).toEqual({
      userAgent: "Mozilla/5.0 Test Browser",
      referer: "https://virajnikam.in/",
      acceptLanguage: "en-US,en;q=0.9",
      country: "IN",
      region: "MH",
      city: "Mumbai",
      timezone: "Asia/Kolkata",
    });
  });
});
