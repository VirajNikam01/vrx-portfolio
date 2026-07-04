import {
    getPersonJsonLd,
    getProfilePageJsonLd,
    getWebsiteJsonLd,
    serializeJsonLd,
} from "@/config/seo";
import { HomePageClient } from "@/components/pages/landing-page/home-page-client";
import { defaultBlogPosts } from "@/config/blog";

export default function Home() {
    const jsonLd = [
        getWebsiteJsonLd(),
        getPersonJsonLd(),
        getProfilePageJsonLd(),
        getBlogPostsJsonLd(defaultBlogPosts),
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serializeJsonLd(jsonLd),
                }}
            />
            <HomePageClient />
        </>
    );
}

function getBlogPostsJsonLd(posts: typeof defaultBlogPosts) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": "https://virajnikam.in/#featured-blog-posts",
        name: "Featured writing",
        itemListOrder: "http://schema.org/ItemListOrderDescending",
        numberOfItems: posts.length,
        itemListElement: posts.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: post.url,
            name: post.title,
            description: post.brief,
        })),
    };
}
