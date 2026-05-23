import type { ExperienceItemType } from "@/features/work-experience";

export const workExperiences = [
  {
    id: "1",
    companyName: "Zybra",
    isCurrentEmployer: true,
    positions: [
      {
        id: "frontend-developer",
        title: "Frontend Developer",
        startDate: "2024-01-01",
        employmentPeriod: "Jan 2024 - Present",
        employmentType: "Project Work",
        icon: "code",
        isExpanded: true,
        description: [
          "Building polished web interfaces with React, Next.js, TypeScript, Tailwind CSS, and animation-focused UI patterns.",
          "Translating product ideas into responsive, accessible, and maintainable frontend experiences.",
        ],
        skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
    ],
  },
  {
    id: "2",
    companyName: "Artoon Solutions",
    positions: [
      {
        id: "software-development",
        title: "Frontend Engineering Practice",
        startDate: "2023-06-01",
        employmentPeriod: "Jun 2023 - Present",
        employmentType: "Learning",
        icon: "education",
        countsTowardExperience: false,
        isExpanded: true,
        description: [
          "Practicing component architecture, responsive layouts, theme systems, and 3D canvas integration.",
          "Improving performance-minded frontend development habits through focused engineering practice.",
        ],
        skills: ["JavaScript", "UI Architecture", "Three.js", "Design Systems"],
      },
    ],
  },
] satisfies ExperienceItemType[];
