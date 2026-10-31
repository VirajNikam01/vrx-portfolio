import { introductionContent } from "@/config/introduction";
import type { IntroductionContentType } from "@/shared/contracts/introduction";

export async function getIntroductionContent(): Promise<IntroductionContentType> {
    return introductionContent;
}
