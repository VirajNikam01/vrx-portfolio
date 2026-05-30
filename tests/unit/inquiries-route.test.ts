import { POST } from "@/app/api/inquiries/route";
import { validateInquiryEmail } from "@/features/inquiries/email-validation";
import { createInquiry } from "@/features/inquiries/repository";
import { createResumeSignedUrl } from "@/features/resume/storage";
import {
  sendInquiryNotification,
  sendResumeDownloadEmail,
} from "@/lib/email/inquiry-notifications";

jest.mock("@/features/inquiries/email-validation", () => ({
  validateInquiryEmail: jest.fn(),
}));

jest.mock("@/features/inquiries/repository", () => ({
  createInquiry: jest.fn(),
}));

jest.mock("@/lib/email/inquiry-notifications", () => ({
  sendInquiryNotification: jest.fn(),
  sendResumeDownloadEmail: jest.fn(),
}));

jest.mock("@/features/resume/storage", () => ({
  createResumeSignedUrl: jest.fn(),
}));

const createInquiryMock = jest.mocked(createInquiry);
const createResumeSignedUrlMock = jest.mocked(createResumeSignedUrl);
const validateInquiryEmailMock = jest.mocked(validateInquiryEmail);
const sendInquiryNotificationMock = jest.mocked(sendInquiryNotification);
const sendResumeDownloadEmailMock = jest.mocked(sendResumeDownloadEmail);

class JsonResponseMock {
  status: number;

  constructor(private readonly body: unknown, init?: ResponseInit) {
    this.status = init?.status ?? 200;
  }

  async json() {
    return this.body;
  }

  static json(body: unknown, init?: ResponseInit) {
    return new JsonResponseMock(body, init);
  }
}

function createJsonRequest(body: unknown, headers?: Record<string, string>) {
  return {
    headers: new Headers(headers),
    json: async () => body,
  } as Request;
}

describe("POST /api/inquiries", () => {
  const originalResponse = global.Response;

  beforeAll(() => {
    global.Response = JsonResponseMock as unknown as typeof Response;
  });

  afterAll(() => {
    global.Response = originalResponse;
  });

  beforeEach(() => {
    createInquiryMock.mockReset();
    createResumeSignedUrlMock.mockReset();
    createResumeSignedUrlMock.mockResolvedValue("https://storage.example.com/signed-resume-url");
    validateInquiryEmailMock.mockReset();
    validateInquiryEmailMock.mockResolvedValue({ valid: true });
    sendInquiryNotificationMock.mockReset();
    sendResumeDownloadEmailMock.mockReset();
  });

  it("stores the inquiry and sends a notification email", async () => {
    const createdAt = new Date("2026-05-25T12:00:00.000Z");
    createInquiryMock.mockResolvedValue({
      id: 1,
      source: "resume_download",
      name: "Viraj Nikam",
      email: "viraj@example.com",
      reason: "I would like to review your resume for a frontend role.",
      metadata: null,
      createdAt,
    });

    const response = await POST(
      createJsonRequest(
        {
          source: "resume_download",
          name: "Viraj Nikam",
          email: "viraj@example.com",
          reason: "I would like to review your resume for a frontend role.",
        },
        {
          "user-agent": "Mozilla/5.0 Test Browser",
          referer: "https://virajnikam.in/",
          "accept-language": "en-US,en;q=0.9",
          "x-vercel-ip-country": "IN",
          "x-vercel-ip-country-region": "MH",
          "x-vercel-ip-city": "Mumbai",
        },
      ),
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      data: {
        id: 1,
        resumeUrl: "https://storage.example.com/signed-resume-url",
      },
    });
    expect(createInquiryMock).toHaveBeenCalledWith({
      source: "resume_download",
      name: "Viraj Nikam",
      email: "viraj@example.com",
      reason: "I would like to review your resume for a frontend role.",
      metadata: {
        userAgent: "Mozilla/5.0 Test Browser",
        referer: "https://virajnikam.in/",
        acceptLanguage: "en-US,en;q=0.9",
        country: "IN",
        region: "MH",
        city: "Mumbai",
        resumeSignedUrlCreated: true,
      },
    });
    expect(validateInquiryEmailMock).toHaveBeenCalledWith("viraj@example.com");
    expect(sendInquiryNotificationMock).toHaveBeenCalledWith({
      source: "resume_download",
      name: "Viraj Nikam",
      email: "viraj@example.com",
      reason: "I would like to review your resume for a frontend role.",
      id: 1,
      createdAt,
      resumeUrl: "https://storage.example.com/signed-resume-url",
    });
    expect(sendResumeDownloadEmailMock).not.toHaveBeenCalled();
  });

  it("returns validation errors for invalid submissions", async () => {
    const response = await POST(
      createJsonRequest({
        source: "resume_download",
        name: "",
        email: "not-an-email",
        reason: "Short",
      }),
    );

    expect(response.status).toBe(400);
    expect(createInquiryMock).not.toHaveBeenCalled();
    expect(sendInquiryNotificationMock).not.toHaveBeenCalled();
    expect(sendResumeDownloadEmailMock).not.toHaveBeenCalled();
  });

  it("rejects disposable or unreachable email addresses", async () => {
    validateInquiryEmailMock.mockResolvedValueOnce({
      valid: false,
      message: "Please use a non-temporary email address.",
    });

    const response = await POST(
      createJsonRequest({
        source: "resume_download",
        name: "Viraj Nikam",
        email: "viraj@mailinator.com",
        reason: "I would like to review your resume for a frontend role.",
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Invalid email address.",
      issues: {
        email: ["Please use a non-temporary email address."],
      },
    });
    expect(createInquiryMock).not.toHaveBeenCalled();
    expect(sendInquiryNotificationMock).not.toHaveBeenCalled();
    expect(sendResumeDownloadEmailMock).not.toHaveBeenCalled();
  });
});
