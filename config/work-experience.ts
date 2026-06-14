import type { ExperienceItemType } from "@/features/work-experience";

export const workExperiences = [
  // {
  //   id: "1",
  //   companyName: "Zybra",
  //   isCurrentEmployer: true,
  //   companyLogo: "/images/work-experience/zybra-logo.svg",
  //   positions: [
  //     {
  //       id: "full-stack-developer",
  //       title: "Software Engineer",
  //       category: "professional",
  //       startDate: "2024-12-27",
  //       employmentType: "Project Work",
  //       icon: "code",
  //       isExpanded: true,
  //       description: [
  //         "Built and managed schemas with Drizzle ORM for PostgreSQL kept things typed, clean, and easy for the team to work with.",
  //         "Migrated the entire legacy MySQL database to PostgreSQL handled the schema changes, data cleanup, and made sure nothing got lost in between.",
  //         "Pulled Tally data into the new system and wrote the reconciliation logic to handle all the weird edge cases accountants run into.",
  //         "Wrote raw SQL wherever the ORM wasn't enough bulk ops, reporting queries, fixing slow joins with proper indexes.",
  //       ],
  //       skills: ["Drizzle", "PostgreSQL", "MySQL", "Tally", "SQL", "Vitest", "PgLite", "Tauri", "Rust"],
  //     },
  // {
  //   id: "frontend-developer",
  //   title: "Full-Stack Developer",
  //   category: "professional",
  //   startDate: "2024-12-27",
  //   endDate: "2025-03-26",
  //   employmentType: "Project Work",
  //   icon: "code",
  //   isExpanded: true,
  //   description: [
  //     "Building polished web interfaces with React, Next.js, TypeScript, Tailwind CSS, and animation-focused UI patterns.",
  //     "Translating product ideas into responsive, accessible, and maintainable frontend experiences.",
  //     "Exploring backend technologies like Hono.js, AWS, etc.",
  //   ],
  //   skills: ["Next.js", "React", "Tailwind CSS"],
  // }
  // ],
  //   },
  {
    id: "2",
    companyName: "Artoon Solutions",
    companyLogo: "/images/work-experience/artoon-logo.png",
    positions: [
      {
        id: "software-development",
        title: "Frontend Developer",
        category: "professional",
        startDate: "2023-07-15",
        endDate: "2024-10-20",
        employmentType: "professional",
        icon: "code",
        isExpanded: true,
        description: [
          "Practicing component architecture, responsive layouts, theme systems, and 3D canvas integration.",
          "Improving performance-minded frontend development habits through focused engineering practice.",
          "Implemented theme systems and responsive layouts inside game UIs, applying the same standards as production web apps.",
          "Worked with canvas and WebGL for 3D rendering, learning how browsers handle graphics at a lower level than typical UI work.",
        ],
        skills: ["Typescript", "Games", "UI Architecture", "Three.js"],
      },
    ],
  },
] satisfies ExperienceItemType[];
