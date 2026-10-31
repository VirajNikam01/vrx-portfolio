import "server-only";
import { seoConfig, seoPages } from "@/config/seo";
import { landingPageContent } from "@/config/landing-page";
import { defaultBlogPosts } from "@/config/blog";
import { getExperienceDurationLabel } from "@/lib/experience-duration";
import { getSiteUrl, getRecommendationPath, getTopicPath } from "./urls";
import type { BlogPostType } from "@/shared/contracts/blog";
import type { RecommendationItem } from "@/shared/contracts/recommendations";
import type { RecommendationTopicItem } from "@/shared/contracts/recommendation-topics";

export function getPersonJsonLd() {
    const experienceDuration = getExperienceDurationLabel(
        landingPageContent.workExperiences,
    );

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": getSiteUrl("/#viraj-nikam"),
        name: seoConfig.name,
        alternateName: [seoConfig.handle, "Viraj", "VRX"],
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
            "Viraj",
            "Viraj Nikam",
            "Viraj Nikam Portfolio",
            "Viraj Portfolio",
            "VRX Portfolio",
        ],
        url: getSiteUrl("/"),
        description: seoConfig.description,
        sameAs: seoConfig.sameAs,
        inLanguage: seoConfig.language,
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
        inLanguage: seoConfig.language,
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

export function getBlogPostsJsonLd(posts: BlogPostType[]) {
    return {
        "@context": "https://schema.org", "@type": "ItemList",
        "@id": getSiteUrl("/#featured-blog-posts"), name: "Featured writing",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: posts.length,
        itemListElement: posts.map((post, index) => ({
            "@type": "ListItem", position: index + 1, url: post.url,
            name: post.title, description: post.brief,
        })),
    };
}

export function getHomeJsonLd() {
    return [getWebsiteJsonLd(), getPersonJsonLd(), getProfilePageJsonLd(), getBlogPostsJsonLd(defaultBlogPosts)];
}

export function getRecommendationsJsonLd() {
    return {
        "@context": "https://schema.org", "@type": "CollectionPage",
        name: seoPages.recommendations.title, description: seoPages.recommendations.description,
        url: getSiteUrl(seoPages.recommendations.path),
        author: { "@type": "Person", name: seoConfig.name },
    };
}

export function getRecommendationJsonLd(item: RecommendationItem, topics: RecommendationTopicItem[]) {
    return {
        "@context": "https://schema.org", "@type": item.type === "book" ? "Book" : "Course",
        name: item.title, author: { "@type": "Person", name: item.author }, description: item.description,
        url: getSiteUrl(getRecommendationPath(item.slug)),
        ...(item.coverImageUrl ? { image: item.coverImageUrl } : {}),
        hasPart: topics.map(topic => ({
            "@type": "WebPage", name: topic.title, url: getSiteUrl(getTopicPath(item.slug, topic.slug)),
        })),
    };
}

export function getTopicJsonLd(recommendation: RecommendationItem, topic: RecommendationTopicItem) {
    const url = getSiteUrl(getTopicPath(recommendation.slug, topic.slug));
    const author = { "@type": "Person", name: seoConfig.name, url: getSiteUrl("/") };
    return {
        "@context": "https://schema.org", "@type": "TechArticle", headline: topic.title,
        description: `Notes for ${topic.title} from ${recommendation.title}`, url,
        author, publisher: author,
        isPartOf: { "@type": "WebPage", name: recommendation.title, url: getSiteUrl(getRecommendationPath(recommendation.slug)) },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
    };
}
