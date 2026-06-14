import { landingPageContent } from "@/config/landing-page";
import { introductionContent } from "@/config/introduction";
import { workExperiences } from "@/config/work-experience";
import { getLandingPageContent } from "@/features/landing-page/api";
import { getIntroductionContent } from "@/features/introduction/api";
import { getWorkExperiences } from "@/features/work-experience/api";

describe("content adapters", () => {
    it("returns the local landing page content", async () => {
        await expect(getLandingPageContent()).resolves.toEqual(
            landingPageContent,
        );
    });

    it("returns the local introduction content", async () => {
        await expect(getIntroductionContent()).resolves.toEqual(
            introductionContent,
        );
    });

    it("returns the local work experience content", async () => {
        await expect(getWorkExperiences()).resolves.toEqual(workExperiences);
    });
});
