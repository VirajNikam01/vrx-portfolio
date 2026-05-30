import { render, screen } from "@testing-library/react";

import { MainContent } from "@/components/pages/landing-page/main-content";
import { landingPageContent } from "@/config/landing-page";
import * as landingPageFeature from "@/features/landing-page";

jest.mock("@/features/landing-page", () => {
  const actual = jest.requireActual("@/features/landing-page");
  return {
    ...actual,
    useLandingPageContent: jest.fn(),
  };
});

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe("MainContent integration", () => {
  const useLandingPageContentMock = jest.mocked(
    landingPageFeature.useLandingPageContent
  );

  beforeEach(() => {
    useLandingPageContentMock.mockReturnValue({ data: landingPageContent } as ReturnType<
      typeof landingPageFeature.useLandingPageContent
    >);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the introduction, work experience timeline, and footer from queried content", () => {
    render(<MainContent />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /A passionate Software Engineer/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(landingPageContent.introduction.headline)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Zybra" })).toBeInTheDocument();
    expect(screen.getByText("Current Employer")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute(
      "href",
      "mailto:virajnikam.connect@gmail.com"
    );
  });

  it("renders nothing while required content is unavailable", () => {
    useLandingPageContentMock.mockReturnValue({ data: undefined } as ReturnType<
      typeof landingPageFeature.useLandingPageContent
    >);

    const { container } = render(<MainContent />);

    expect(container).toBeEmptyDOMElement();
  });

  it("does not render sections disabled by feature flags", () => {
    useLandingPageContentMock.mockReturnValue({
      data: {
        ...landingPageContent,
        featureFlags: {
          ...landingPageContent.featureFlags,
          showWorkExperience: false,
        },
      },
    } as ReturnType<typeof landingPageFeature.useLandingPageContent>);

    render(<MainContent />);

    expect(screen.queryByRole("heading", { name: "Experience" })).not.toBeInTheDocument();
  });
});
