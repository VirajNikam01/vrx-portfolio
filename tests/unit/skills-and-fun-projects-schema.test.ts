import { skillsSchema } from "@/features/skills/schema";
import { funProjectsSchema } from "@/features/fun-projects/schema";
import { landingPageContentSchema } from "@/features/landing-page/schema";
import { defaultSkills } from "@/config/skills";
import { defaultFunProjects } from "@/config/fun-projects";
import { landingPageContent } from "@/config/landing-page";

describe("Skills and Fun Projects Schemas", () => {
    it("validates default skills configuration", () => {
        const result = skillsSchema.safeParse(defaultSkills);
        expect(result.success).toBe(true);
    });

    it("validates default fun projects configuration", () => {
        const result = funProjectsSchema.safeParse(defaultFunProjects);
        expect(result.success).toBe(true);
    });

    it("validates complete landing page content schema with skills and fun projects", () => {
        const result = landingPageContentSchema.safeParse(landingPageContent);
        expect(result.success).toBe(true);
    });
});
