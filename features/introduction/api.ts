import { introductionContent } from "@/config/introduction";
import type { IntroductionContentType } from "./types";

export async function getIntroductionContent(): Promise<IntroductionContentType> {
    return introductionContent;
}
