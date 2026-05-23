import { resumeDownloadRequestSchema } from "@/features/introduction/schema";

describe("resume download request schema", () => {
  it("accepts a complete download request", () => {
    expect(() =>
      resumeDownloadRequestSchema.parse({
        name: "Viraj Nikam",
        email: "viraj@example.com",
        reason: "I would like to discuss a frontend opportunity.",
      })
    ).not.toThrow();
  });

  it("rejects incomplete contact details", () => {
    const result = resumeDownloadRequestSchema.safeParse({
      name: "V",
      email: "not-an-email",
      reason: "Too short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path.join("."))).toEqual([
        "name",
        "email",
        "reason",
      ]);
    }
  });
});
