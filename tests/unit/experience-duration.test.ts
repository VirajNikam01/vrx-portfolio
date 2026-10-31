import { getExperienceDurationLabel, getPositionDurationLabel, getPositionPeriodLabel } from "@/lib/experience-duration";
import type { ExperienceItemType } from "@/shared/contracts/work-experience";

const experience = (
  positions: ExperienceItemType["positions"]
): ExperienceItemType => ({
  id: "test-company",
  companyName: "Test Company",
  positions,
});

describe("experience duration helpers", () => {
  it("merges overlapping professional roles and ignores non-professional roles", () => {
    const experiences = [
      experience([
        {
          id: "frontend",
          title: "Frontend Developer",
          category: "professional",
          startDate: "2023-01-01",
          endDate: "2023-03-31",
        },
        {
          id: "fullstack",
          title: "Full-Stack Developer",
          category: "professional",
          startDate: "2023-03-01",
          endDate: "2023-05-31",
        },
        {
          id: "course",
          title: "Course",
          category: "education",
          startDate: "2023-06-01",
          endDate: "2023-06-30",
        },
      ]),
    ];

    expect(getExperienceDurationLabel(experiences)).toBe("5 months");
  });

  it("counts exact month boundaries for active positions", () => {
    expect(
      getPositionDurationLabel(
        {
          id: "current",
          title: "Current Role",
          category: "professional",
          startDate: "2025-05-28",
        },
        new Date("2025-06-28T00:00:00")
      )
    ).toBe("1 month");
  });

  it("formats active positions using the supplied current date", () => {
    expect(
      getPositionDurationLabel(
        {
          id: "current",
          title: "Current Role",
          category: "professional",
          startDate: "2024-12-01",
        },
        new Date("2026-02-15T00:00:00")
      )
    ).toBe("1 year 2 months");
  });
  it("uses Present for open-ended position periods", () => {
    expect(
      getPositionPeriodLabel({
        id: "current",
        title: "Current Role",
        category: "professional",
        startDate: "2024-12-01",
      })
    ).toBe("1 December 2024 - Present");
  });
});
