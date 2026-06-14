import { and, eq } from "drizzle-orm";

import { landingPageContent } from "@/config/landing-page";
import { getDb } from "@/lib/db/client";
import { portfolioPages } from "@/lib/db/schema";

import { landingPageContentSchema } from "./schema";
import type { LandingPageContentType } from "./types";

const LANDING_PAGE_KEY = "landing-page";
const PUBLISHED_STATUS = "published";

export async function readLandingPageContent(): Promise<LandingPageContentType> {
    if (!process.env.DATABASE_URL) {
        return landingPageContent;
    }

    try {
        return await readLandingPageContentFromDatabase();
    } catch {
        return landingPageContent;
    }
}

async function readLandingPageContentFromDatabase() {
    const db = getDb();
    const [page] = await db
        .select({
            content: portfolioPages.content,
        })
        .from(portfolioPages)
        .where(
            and(
                eq(portfolioPages.key, LANDING_PAGE_KEY),
                eq(portfolioPages.status, PUBLISHED_STATUS),
            ),
        )
        .limit(1);

    if (!page) {
        return landingPageContent;
    }

    return landingPageContentSchema.parse(page.content);
}
