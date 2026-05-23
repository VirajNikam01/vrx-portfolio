import {
  getExperienceDurationLabel,
  getPositionDurationLabel,
  getPositionPeriodLabel,
} from "@/features/work-experience";
import type { ExperienceItemType } from "@/features/work-experience";

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
    ).toBe("1 year 3 months");
  });

  it("uses Present for open-ended position periods", () => {
    expect(
      getPositionPeriodLabel({
        id: "current",
        title: "Current Role",
        category: "professional",
        startDate: "2024-12-01",
      })
    ).toBe("Dec 2024 - Present");
  });
});
