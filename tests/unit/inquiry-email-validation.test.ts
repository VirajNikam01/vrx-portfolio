import { resolveMx } from "node:dns/promises";

import {
  isDisposableEmailDomain,
  validateInquiryEmail,
} from "@/backend/validation/inquiry-email";

jest.mock("node:dns/promises", () => ({
  resolveMx: jest.fn(),
}));

const resolveMxMock = jest.mocked(resolveMx);

describe("inquiry email validation", () => {
  beforeEach(() => {
    resolveMxMock.mockReset();
  });

  it("identifies disposable email domains and their subdomains", () => {
    expect(isDisposableEmailDomain("mailinator.com")).toBe(true);
    expect(isDisposableEmailDomain("inbound.mailinator.com")).toBe(true);
    expect(isDisposableEmailDomain("gmail.com")).toBe(false);
  });

  it("accepts non-disposable emails with MX records", async () => {
    resolveMxMock.mockResolvedValue([{ exchange: "mx.example.com", priority: 10 }]);

    await expect(validateInquiryEmail("person@example.com")).resolves.toEqual({
      valid: true,
    });
  });

  it("rejects disposable emails before doing a DNS lookup", async () => {
    await expect(validateInquiryEmail("person@mailinator.com")).resolves.toEqual({
      valid: false,
      message: "Please use a non-temporary email address.",
    });
    expect(resolveMxMock).not.toHaveBeenCalled();
  });

  it("rejects email domains without MX records", async () => {
    resolveMxMock.mockResolvedValue([]);

    await expect(validateInquiryEmail("person@example.com")).resolves.toEqual({
      valid: false,
      message: "Please use an email address that can receive mail.",
    });
  });
});
