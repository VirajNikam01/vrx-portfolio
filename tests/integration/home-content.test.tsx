import { render, screen } from "@testing-library/react";

import { HomeContent } from "@/app/components/pages/home/home-content";
import { landingPageContent } from "@/config/landing-page";
import { AppProviders } from "@/providers/app-providers";

describe("HomeContent integration", () => {
    it("renders the introduction, Blog, work experience timeline, and footer from provided content", () => {
        render(
            <AppProviders>
                <HomeContent />
            </AppProviders>,
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
            <AppProviders>
                <HomeContent />
            </AppProviders>,
        );

        expect(
            screen.queryByRole("heading", { name: "Experience" }),
        ).not.toBeInTheDocument();
    });
});
