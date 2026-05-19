import type { ExperienceItemType } from "@/components/pages/landing-page/sections/work-experience";

export const workExperiences = [
  {
    id: "independent-projects",
    companyName: "Independent Projects",
    isCurrentEmployer: true,
    positions: [
      {
        id: "frontend-developer",
        title: "Frontend Developer",
        employmentPeriod: "2024 - Present",
        employmentType: "Project Work",
        icon: "code",
        isExpanded: true,
        description:
          "Building polished web interfaces with React, Next.js, TypeScript, Tailwind CSS, and animation-focused UI patterns.",
        skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
    ],
  },
  {
    id: "engineering-practice",
    companyName: "Engineering Practice",
    positions: [
      {
        id: "software-development",
        title: "Software Development",
        employmentPeriod: "Ongoing",
        employmentType: "Learning",
        icon: "education",
        description:
          "Practicing component architecture, responsive layouts, theme systems, 3D canvas integration, and performance-minded frontend development.",
        skills: ["JavaScript", "UI Architecture", "Three.js", "Design Systems"],
      },
    ],
  },
] satisfies ExperienceItemType[];
