import { render, screen } from "@testing-library/react";

import { MainContent } from "@/components/pages/landing-page/main-content";
import { introductionContent } from "@/config/introduction";
import { workExperiences } from "@/config/work-experience";
import * as introductionFeature from "@/features/introduction";
import * as workExperienceFeature from "@/features/work-experience";

jest.mock("@/features/introduction", () => {
  const actual = jest.requireActual("@/features/introduction");
  return {
    ...actual,
    useIntroductionContent: jest.fn(),
  };
});

jest.mock("@/features/work-experience", () => {
  const actual = jest.requireActual("@/features/work-experience");
  return {
    ...actual,
    useWorkExperiences: jest.fn(),
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
  const useIntroductionContentMock = jest.mocked(
    introductionFeature.useIntroductionContent
  );
  const useWorkExperiencesMock = jest.mocked(
    workExperienceFeature.useWorkExperiences
  );

  beforeEach(() => {
    useIntroductionContentMock.mockReturnValue({ data: introductionContent } as ReturnType<
      typeof introductionFeature.useIntroductionContent
    >);
    useWorkExperiencesMock.mockReturnValue({ data: workExperiences } as ReturnType<
      typeof workExperienceFeature.useWorkExperiences
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
        name: /A passionate Frontend Developer/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(introductionContent.headline)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Zybra" })).toBeInTheDocument();
    expect(screen.getByText("Current Employer")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute(
      "href",
      "mailto:hello@example.com"
    );
  });

  it("renders nothing while required content is unavailable", () => {
    useIntroductionContentMock.mockReturnValue({ data: undefined } as ReturnType<
      typeof introductionFeature.useIntroductionContent
    >);

    const { container } = render(<MainContent />);

    expect(container).toBeEmptyDOMElement();
  });
});
