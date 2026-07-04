import type { BlogPostType } from "@/features/blog";

export const defaultBlogPosts = [
    {
        title: "Build Desktop Applications with Tauri",
        slug: "build-desktop-applications-with-tauri",
        brief:
            "1. Story behind.\n\"JavaScript developers can’t build anything except web applications.\" Every time I hear this, my reaction is — Really? 🤔\nMany people think JavaScript is limited to just web development, but that’s far from the truth. Trust me, JavaS...",
        publishedAt: "Mon, 04 Aug 2025 21:46:51 GMT",
        url: "https://blog.virajnikam.in/build-desktop-applications-with-tauri",
    },
    {
        title: "IndexedDB - browsers own storage system.",
        slug: "indexeddb-browsers-own-storage-system",
        brief:
            "Introduction.\nIn a recent article, I introduced Dexie.js, a wrapper library for IndexedDB that simplifies working with it. I should have published this article about using IndexedDB with native APIs before the Dexie.js article. Why? Because only when...",
        publishedAt: "Sat, 19 Jul 2025 10:37:09 GMT",
        url: "https://blog.virajnikam.in/indexeddb-browsers-own-storage-system",
    },
    {
        title: "Dexie.js : The Smart Way to Handel Local Database in JavaScript",
        slug: "dexiejs-learn-the-basics",
        brief:
            "Introduction\nIf you’ve ever worked with IndexedDB, you know it can be a bit painful—lots of boilerplate and a complex API just to do simple things. That’s where Dexie.js comes in. It’s a lightweight wrapper that makes IndexedDB simple, clean, and dev...",
        publishedAt: "Tue, 08 Jul 2025 19:03:15 GMT",
        url: "https://blog.virajnikam.in/dexiejs-learn-the-basics",
    },
    {
        title: "React Hook Form",
        slug: "react-hook-form",
        brief:
            "Lesson 1: Story behind.\nBefore I discovered React Hook Form, I realized I was a complete noob when it came to handling form data in React. I used to manage form state and validations using local state variables. While this approach works for simple f...",
        publishedAt: "Fri, 27 Jun 2025 13:37:34 GMT",
        url: "https://blog.virajnikam.in/react-hook-form",
    },
] satisfies BlogPostType[];
