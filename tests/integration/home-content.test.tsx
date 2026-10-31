import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomeContent } from "@/app/components/pages/home/home-content";
import { SiteFooter } from "@/app/components/organisms/layout/site-footer";
import { landingPageContent } from "@/config/landing-page";
import { landingPageApi } from "@/lib/api/landing-page";

jest.mock("@/lib/api/landing-page", () => ({ landingPageApi: { fetchLandingPageContent: jest.fn() } }));
jest.mock("@/app/blogs/components/organisms/blog-section", () => ({ BlogSection: () => null }));
jest.mock("@/app/recommendations/components/organisms/recommendations-preview", () => ({ RecommendationsPreview: () => null }));
jest.mock("@/app/components/organisms/work-experience", () => ({ WorkExperience: () => null }));

function renderContent(children = <HomeContent />) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    return render(<QueryClientProvider client={client}>{children}</QueryClientProvider>);
}

beforeEach(() => jest.resetAllMocks());

describe("HomeContent integration", () => {
    it("shows loading without default content while the request is pending", () => {
        jest.mocked(landingPageApi.fetchLandingPageContent).mockReturnValue(new Promise(() => {}));
        renderContent();
        expect(screen.getByRole("status")).toHaveTextContent("Loading content");
        expect(screen.queryByText(landingPageContent.introduction.headline)).not.toBeInTheDocument();
    });

    it("renders frontend defaults when the API fails", async () => {
        jest.mocked(landingPageApi.fetchLandingPageContent).mockRejectedValue(new Error("database unavailable"));
        renderContent();
        expect(await screen.findByRole("link", { name: /email/i })).toHaveAttribute("href", `mailto:${landingPageContent.meta.email}`);
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("uses API content when the request succeeds", async () => {
        const storedContent = { ...landingPageContent, featureFlags: {
            showIntroduction: false, showWorkExperience: false, showBlog: false,
            showRecommendations: false, showSkills: false, showFunProjects: false,
        }, meta: { ...landingPageContent.meta, email: "stored@example.com" } };
        jest.mocked(landingPageApi.fetchLandingPageContent).mockResolvedValue({ data: storedContent });
        renderContent();
        expect(await screen.findByRole("link", { name: /email/i })).toHaveAttribute("href", "mailto:stored@example.com");
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(screen.queryByRole("heading", { name: "Experience" })).not.toBeInTheDocument();
    });

    it("keeps the shared footer safe without landing data on other routes", () => {
        jest.mocked(landingPageApi.fetchLandingPageContent).mockReturnValue(new Promise(() => {}));
        const { container } = renderContent(<SiteFooter />);
        expect(container).toBeEmptyDOMElement();
    });
});
