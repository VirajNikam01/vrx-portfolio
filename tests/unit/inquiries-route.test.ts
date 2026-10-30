import { POST } from "@/app/api/inquiries/route";
import { validateInquiryEmail } from "@/backend/validation/inquiry-email";
import { inquiriesRepository } from "@/backend/repository/inquiries";
import { createResumeSignedUrl } from "@/backend/integrations/storage/resume";
import { visitorsService } from "@/backend/services/visitors";
import { notificationsService } from "@/backend/services/notifications";

jest.mock("@/backend/validation/inquiry-email", () => ({
  validateInquiryEmail: jest.fn(),
}));

jest.mock("@/backend/repository/inquiries", () => ({
  inquiriesRepository: { createInquiry: jest.fn() },
}));

jest.mock("@/backend/services/visitors", () => ({
  visitorsService: {
    ensureVisitor: jest.fn(),
  },
}));

jest.mock("@/backend/services/notifications", () => ({
  notificationsService: { sendInquiryNotification: jest.fn(), sendResumeDownloadEmail: jest.fn() },
}));

jest.mock("@/backend/integrations/storage/resume", () => ({
  createResumeSignedUrl: jest.fn(),
}));

const createInquiryMock = jest.mocked(inquiriesRepository.createInquiry);
const createResumeSignedUrlMock = jest.mocked(createResumeSignedUrl);
const validateInquiryEmailMock = jest.mocked(validateInquiryEmail);
const visitorsServiceMock = jest.mocked(visitorsService);
const sendInquiryNotificationMock = jest.mocked(notificationsService.sendInquiryNotification);
const sendResumeDownloadEmailMock = jest.mocked(notificationsService.sendResumeDownloadEmail);

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
    visitorsServiceMock.ensureVisitor.mockReset();
    sendInquiryNotificationMock.mockReset();
    sendResumeDownloadEmailMock.mockReset();
  });

  it("stores the inquiry and sends a notification email", async () => {
    const createdAt = new Date("2026-05-25T12:00:00.000Z");
    createInquiryMock.mockResolvedValue({
      id: 1,
      source: "resume_download",
      visitorId: "visitor-123",
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
          "x-client-fp": "visitor-123",
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
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      data: {
        id: 1,
        resumeUrl: "https://storage.example.com/signed-resume-url",
      },
    });
    expect(createInquiryMock).toHaveBeenCalledWith({
      source: "resume_download",
      visitorId: "visitor-123",
      name: "Viraj Nikam",
      email: "viraj@example.com",
      reason: "I would like to review your resume for a frontend role.",
      metadata: {
        userAgent: "Mozilla/5.0 Test Browser",
        referer: "https://virajnikam.in/",
        acceptLanguage: "en-US,en;q=0.9",
        fingerprintHash: "visitor-123",
        country: "IN",
        region: "MH",
        city: "Mumbai",
        resumeSignedUrlCreated: true,
      },
    });
    expect(visitorsServiceMock.ensureVisitor).toHaveBeenCalledWith("visitor-123");
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

  it("stores contact_me inquiries without creating a resume URL", async () => {
    const createdAt = new Date("2026-05-25T13:00:00.000Z");
    createInquiryMock.mockResolvedValue({
      id: 2,
      source: "contact_me",
      visitorId: "visitor-456",
      name: "Asha Shah",
      email: "asha@example.com",
      reason: "I would like to discuss a dashboard project with you.",
      metadata: null,
      createdAt,
    });

    const response = await POST(
      createJsonRequest(
        {
          source: "contact_me",
          name: "Asha Shah",
          email: "asha@example.com",
          reason: "I would like to discuss a dashboard project with you.",
        },
        {
          "x-client-fp": "visitor-456",
          "user-agent": "Mozilla/5.0 Test Browser",
        },
      ),
    );

    expect(response.status).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      data: {
        id: 2,
      },
    });
    expect(createResumeSignedUrlMock).not.toHaveBeenCalled();
    expect(createInquiryMock).toHaveBeenCalledWith({
      source: "contact_me",
      visitorId: "visitor-456",
      name: "Asha Shah",
      email: "asha@example.com",
      reason: "I would like to discuss a dashboard project with you.",
      metadata: {
        userAgent: "Mozilla/5.0 Test Browser",
        fingerprintHash: "visitor-456",
      },
    });
    expect(sendInquiryNotificationMock).toHaveBeenCalledWith({
      source: "contact_me",
      name: "Asha Shah",
      email: "asha@example.com",
      reason: "I would like to discuss a dashboard project with you.",
      id: 2,
      createdAt,
      resumeUrl: undefined,
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
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      error: "Invalid email address.",
      issues: {
        email: ["Please use a non-temporary email address."],
      },
    });
    expect(createInquiryMock).not.toHaveBeenCalled();
    expect(sendInquiryNotificationMock).not.toHaveBeenCalled();
    expect(sendResumeDownloadEmailMock).not.toHaveBeenCalled();
  });

  it("rejects missing visitor identity before performing any side effects", async () => {
    const response = await POST(createJsonRequest({
      source: "contact_me", name: "Asha Shah", email: "asha@example.com",
      reason: "I would like to discuss a project with you.",
    }));
    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      error: "Visitor identity is missing.",
      issues: { visitorId: ["Unable to identify the visitor for this inquiry."] },
    });
    expect(visitorsServiceMock.ensureVisitor).not.toHaveBeenCalled();
    expect(createInquiryMock).not.toHaveBeenCalled();
  });

  it("treats malformed JSON as an invalid submission", async () => {
    const response = await POST({ json: async () => { throw new Error("Invalid JSON"); } } as unknown as Request);
    expect(response.status).toBe(400);
    expect(validateInquiryEmailMock).not.toHaveBeenCalled();
  });

  it("preserves side-effect order and returns an error if notification fails after persistence", async () => {
    const order: string[] = [];
    validateInquiryEmailMock.mockImplementation(async () => { order.push("validate"); return { valid: true }; });
    visitorsServiceMock.ensureVisitor.mockImplementation(async () => { order.push("visitor"); });
    createResumeSignedUrlMock.mockImplementation(async () => { order.push("resume"); return "https://example.com/resume"; });
    createInquiryMock.mockImplementation(async values => {
      order.push("inquiry");
      return { ...values, id: 3, visitorId: values.visitorId ?? null, metadata: values.metadata ?? null, createdAt: new Date() };
    });
    sendInquiryNotificationMock.mockImplementation(async () => { order.push("notification"); throw new Error("Notification failed"); });
    const log = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      const response = await POST(createJsonRequest({
        source: "resume_download", name: "Asha Shah", email: "asha@example.com",
        reason: "I would like to review your frontend experience.",
      }, { "x-client-fp": "visitor" }));
      expect(response.status).toBe(500);
      const responseBody = await response.json();
      expect(responseBody).toEqual({ error: "Notification failed" });
      expect(order).toEqual(["validate", "visitor", "resume", "inquiry", "notification"]);
      expect(createInquiryMock).toHaveBeenCalledTimes(1);
    } finally { log.mockRestore(); }
  });
});
