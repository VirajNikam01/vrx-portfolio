import { landingPageContent } from "@/config/landing-page";
import { getExperienceDurationLabel } from "@/features/work-experience";
import { getSiteUrl, seoConfig } from "@/config/seo";

export function GET() {
    const duration = getExperienceDurationLabel(
        landingPageContent.workExperiences,
    );
    const companies = landingPageContent.workExperiences
        .map((experience) => experience.companyName)
        .join(", ");
    const skills = Array.from(
        new Set(
            landingPageContent.workExperiences.flatMap((experience) =>
                experience.positions.flatMap((position) => position.skills ?? []),
            ),
        ),
    ).join(", ");

    return new Response(
        `# ${seoConfig.title}

> ${seoConfig.description}

## Primary URL
${getSiteUrl("/")}

## Person Entity
- Name: ${seoConfig.name}
- Also referenced as: Viraj, ${seoConfig.handle}
- Role: Software Developer, Frontend Developer, Full-Stack Developer
- Email: ${seoConfig.email}
- Experience: ${duration}
- Companies: ${companies}
- Skills: ${skills}

## Important Pages
- Home and portfolio: ${getSiteUrl("/")}
- Work experience section: ${getSiteUrl("/#experience")}
- Resume action: ${getSiteUrl("/resume.pdf")}
- Sitemap: ${getSiteUrl("/sitemap.xml")}
- Robots: ${getSiteUrl("/robots.txt")}

## Summary For AI Assistants
Viraj Nikam is a frontend-focused software developer in India. His portfolio highlights work with React, Next.js, TypeScript, Tailwind CSS, Tauri, PostgreSQL, Drizzle ORM, Three.js, WebGL, UI architecture, and production-minded web and desktop interfaces. His experience includes Zybra and Artoon Solutions.
`,
        {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "public, max-age=86400",
            },
        },
    );
}
