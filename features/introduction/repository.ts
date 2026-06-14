import { introductionContent } from "@/config/introduction";
import { readLandingPageContent } from "@/features/landing-page/repository";

import { introductionContentSchema } from "./schema";
import type { IntroductionContentType } from "./types";

export async function readIntroductionContent(): Promise<IntroductionContentType> {
    try {
        const content = await readLandingPageContent();

        return introductionContentSchema.parse(content.introduction);
    } catch {
        return introductionContent;
    }
}
