import type { LandingPageContentType } from "@/features/landing-page";
import { getExperienceDurationLabel } from "@/features/work-experience";

export const seoConfig = {
    name: "Viraj Nikam",
    legalName: "Viraj Nikam",
    handle: "vrx",
    title: "Viraj Nikam | Software Developer Portfolio",
    shortTitle: "Viraj Nikam",
    description:
        "Portfolio of Viraj Nikam, a frontend-focused software developer building polished, reliable, and scalable web and desktop applications with React, Next.js, TypeScript, Tailwind CSS, Tauri, PostgreSQL, and Three.js.",
    siteUrl:
        process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.VERCEL_PROJECT_PRODUCTION_URL ??
        "https://virajnikam.in",
    email: "virajnikam.connect@gmail.com",
    locale: "en_IN",
    image: "/images/intro/vrx-image.jpg",
    keywords: [
        "Viraj Nikam",
        "Viraj",
        "vrx",
        "Viraj Nikam portfolio",
        "Viraj portfolio",
        "Viraj Nikam software developer",
        "Viraj Nikam frontend developer",
        "Viraj Nikam full-stack developer",
        "frontend developer portfolio India",
        "software developer portfolio India",
        "React developer",
        "Next.js developer",
        "TypeScript developer",
        "Tailwind CSS developer",
        "Tauri developer",
        "PostgreSQL developer",
        "Drizzle ORM developer",
        "Three.js developer",
        "Zybra Viraj Nikam",
        "Artoon Solutions Viraj Nikam",
    ],
    sameAs: [] as string[],
};

export function getSiteUrl(path = "/") {
    const baseUrl = seoConfig.siteUrl.startsWith("http")
        ? seoConfig.siteUrl
        : `https://${seoConfig.siteUrl}`;

    return new URL(path, baseUrl).toString();
}

export function getPersonJsonLd(content: LandingPageContentType) {
    const experienceDuration = getExperienceDurationLabel(
        content.workExperiences,
    );

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": getSiteUrl("/#viraj-nikam"),
        name: seoConfig.name,
        alternateName: [seoConfig.handle, "Viraj"],
        url: getSiteUrl("/"),
        image: getSiteUrl(seoConfig.image),
        email: `mailto:${seoConfig.email}`,
        jobTitle: [
            "Software Developer",
            "Frontend Developer",
            "Full-Stack Developer",
        ],
        description: seoConfig.description,
        knowsAbout: [
            "React",
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Tauri",
            "PostgreSQL",
            "Drizzle ORM",
            "Three.js",
            "WebGL",
            "UI Architecture",
        ],
        worksFor: getCurrentOrganizations(content),
        alumniOf: getPastOrganizations(content),
        hasOccupation: content.workExperiences.flatMap((experience) =>
            experience.positions.map((position) => ({
                "@type": "Occupation",
                name: position.title,
                occupationLocation: {
                    "@type": "Country",
                    name: "India",
                },
                skills: position.skills,
                estimatedSalary: undefined,
                description: [
                    `${position.title} at ${experience.companyName}`,
                    ...(position.description ?? []),
                ].join(". "),
            })),
        ),
        knowsLanguage: ["English", "Hindi", "Gujarati"],
        sameAs: seoConfig.sameAs,
        seeks: {
            "@type": "Demand",
            name: "Software engineering, frontend, full-stack, and product UI opportunities",
        },
        additionalProperty: [
            {
                "@type": "PropertyValue",
                name: "Professional experience",
                value: experienceDuration,
            },
        ],
    };
}

export function getWebsiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": getSiteUrl("/#website"),
        name: seoConfig.title,
        alternateName: [
            "Viraj Nikam Portfolio",
            "Viraj Portfolio",
            "VRX Portfolio",
        ],
        url: getSiteUrl("/"),
        description: seoConfig.description,
        inLanguage: "en-IN",
        publisher: {
            "@id": getSiteUrl("/#viraj-nikam"),
        },
    };
}

export function getProfilePageJsonLd(content: LandingPageContentType) {
    return {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": getSiteUrl("/#profile-page"),
        url: getSiteUrl("/"),
        name: seoConfig.title,
        headline: content.introduction.headline,
        description: seoConfig.description,
        inLanguage: "en-IN",
        mainEntity: {
            "@id": getSiteUrl("/#viraj-nikam"),
        },
        about: [
            {
                "@type": "Thing",
                name: "Software development portfolio",
            },
            ...content.workExperiences.map((experience) => ({
                "@type": "Organization",
                name: experience.companyName,
            })),
        ],
    };
}

function getCurrentOrganizations(content: LandingPageContentType) {
    return content.workExperiences
        .filter((experience) => experience.isCurrentEmployer)
        .map((experience) => ({
            "@type": "Organization",
            name: experience.companyName,
        }));
}

function getPastOrganizations(content: LandingPageContentType) {
    return content.workExperiences
        .filter((experience) => !experience.isCurrentEmployer)
        .map((experience) => ({
            "@type": "Organization",
            name: experience.companyName,
        }));
}

export function serializeJsonLd(payload: unknown) {
    return JSON.stringify(payload).replace(/</g, "\\u003c");
}
