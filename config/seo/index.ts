import { landingPageContent } from "@/config/landing-page";
import { getExperienceDurationLabel } from "@/features/work-experience";

export const seoConfig = {
    name: "Viraj Nikam",
    legalName: "Viraj Nikam",
    handle: "vrx",
    title: "Viraj Nikam | Software Developer in India",
    shortTitle: "Viraj Nikam",
    description:
        "Viraj Nikam is a frontend-focused software developer building fast, SEO-friendly websites and polished product interfaces with React, Next.js, TypeScript, Tailwind CSS, Tauri, and PostgreSQL.",
    siteUrl:
        process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.VERCEL_PROJECT_PRODUCTION_URL ??
        "https://virajnikam.in",
    email: "virajnikam.connect@gmail.com",
    locale: "en_IN",
    image: "/images/intro/vrx-image.jpg",
    keywords: [
        "Viraj Nikam",
        "Viraj Nikam portfolio",
        "Viraj Nikam software developer",
        "Viraj Nikam frontend developer",
        "Viraj Nikam React developer",
        "Viraj Nikam Next.js developer",
        "software developer in India",
        "frontend developer in India",
        "React developer",
        "Next.js developer",
        "TypeScript developer",
        "Tailwind CSS developer",
        "Tauri developer",
        "PostgreSQL developer",
        "Drizzle ORM developer",
        "Three.js developer",
    ],
    sameAs: [] as string[],
};

export function getSiteUrl(path = "/") {
    const baseUrl = seoConfig.siteUrl.startsWith("http")
        ? seoConfig.siteUrl
        : `https://${seoConfig.siteUrl}`;

    return new URL(path, baseUrl).toString();
}

export function getPersonJsonLd() {
    const experienceDuration = getExperienceDurationLabel(
        landingPageContent.workExperiences,
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
        worksFor: getCurrentOrganizations(),
        alumniOf: getPastOrganizations(),
        hasOccupation: landingPageContent.workExperiences.flatMap((experience) =>
            experience.positions.map((position) => ({
                "@type": "Occupation",
                name: position.title,
                occupationLocation: {
                    "@type": "Country",
                    name: "India",
                },
                skills: position.skills,
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

export function getProfilePageJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": getSiteUrl("/#profile-page"),
        url: getSiteUrl("/"),
        name: seoConfig.title,
        headline: landingPageContent.introduction.headline,
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
            {
                "@type": "Thing",
                name: "Frontend development",
            },
            {
                "@type": "Thing",
                name: "Next.js portfolio",
            },
        ],
    };
}

export function serializeJsonLd(payload: unknown) {
    return JSON.stringify(payload).replace(/</g, "\\u003c");
}

function getCurrentOrganizations() {
    return landingPageContent.workExperiences
        .filter((experience) => experience.isCurrentEmployer)
        .map((experience) => ({
            "@type": "Organization",
            name: experience.companyName,
        }));
}

function getPastOrganizations() {
    return landingPageContent.workExperiences
        .filter((experience) => !experience.isCurrentEmployer)
        .map((experience) => ({
            "@type": "Organization",
            name: experience.companyName,
        }));
}
