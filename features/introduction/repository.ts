import { introductionContent } from "@/config/introduction";

import type { IntroductionContentType } from "./types";

export async function readIntroductionContent(): Promise<IntroductionContentType> {
    return introductionContent;
}
