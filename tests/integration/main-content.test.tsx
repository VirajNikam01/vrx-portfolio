import { render, screen } from "@testing-library/react";

import { MainContent } from "@/components/pages/landing-page/main-content";
import { landingPageContent } from "@/config/landing-page";

describe("MainContent integration", () => {
    it("renders the introduction, work experience timeline, and footer from provided content", () => {
        render(
            <MainContent
                content={{
                    ...landingPageContent,
                    featureFlags: {
                        ...landingPageContent.featureFlags,
                        showWorkExperience: true,
                    },
                    sections: landingPageContent.sections.map((section) =>
                        section.key === "workExperience"
                            ? { ...section, isEnabled: true }
                            : section,
                    ),
                }}
            />,
        );

        expect(
            screen.getByRole("heading", {
                level: 1,
                name: /Viraj Nikam/i,
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByText(landingPageContent.introduction.headline),
        ).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Zybra" })).toBeInTheDocument();
        expect(screen.getByText("Current Employer")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute(
            "href",
            "mailto:virajnikam.connect@gmail.com",
        );
    });

    it("does not render sections disabled by feature flags", () => {
        render(
            <MainContent
                content={{
                    ...landingPageContent,
                }}
            />,
        );

        expect(
            screen.queryByRole("heading", { name: "Experience" }),
        ).not.toBeInTheDocument();
    });
});
