import { asc, eq } from "drizzle-orm";

import { introductionContent } from "@/config/introduction";
import { getDb } from "@/lib/db/client";
import {
    introductionActions,
    introductions,
    introductionStatementSegments,
} from "@/lib/db/schema";

import { introductionContentSchema } from "./schema";
import type { IntroductionContentType } from "./types";

const INTRODUCTION_KEY = "landing-page-introduction";
const PUBLISHED_STATUS = "published";

export async function readIntroductionContent(): Promise<IntroductionContentType> {
    if (!process.env.DATABASE_URL) {
        return introductionContent;
    }

    try {
        return await readIntroductionContentFromDatabase();
    } catch {
        return introductionContent;
    }
}

async function readIntroductionContentFromDatabase() {
    const db = getDb();
    const [intro] = await db
        .select()
        .from(introductions)
        .where(eq(introductions.key, INTRODUCTION_KEY))
        .limit(1);

    if (!intro || intro.status !== PUBLISHED_STATUS) {
        return introductionContent;
    }

    const [statement, actions] = await Promise.all([
        db
            .select()
            .from(introductionStatementSegments)
            .where(eq(introductionStatementSegments.introductionId, intro.id))
            .orderBy(asc(introductionStatementSegments.sortOrder)),
        db
            .select()
            .from(introductionActions)
            .where(eq(introductionActions.introductionId, intro.id))
            .orderBy(asc(introductionActions.sortOrder)),
    ]);

    const connect = actions.find((action) => action.kind === "connect");
    const resume = actions.find((action) => action.kind === "resume");

    if (!connect?.href || !resume?.fileUrl) {
        return introductionContent;
    }

    return introductionContentSchema.parse({
        eyebrow: intro.eyebrow,
        headline: intro.headline,
        intro: intro.intro,
        image: {
            src: intro.imageSrc,
            alt: intro.imageAlt,
        },
        statement: statement.map((segment) => ({
            text: segment.text,
            ...(segment.emphasis ? { emphasis: segment.emphasis } : {}),
        })),
        actions: {
            connect: {
                label: connect.label,
                href: connect.href,
            },
            resume: {
                label: resume.label,
                fileUrl: resume.fileUrl,
            },
        },
    });
}
