import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IntroductionActions } from "@/features/introduction/components/introduction-actions";
import { introductionContent } from "@/config/introduction";

describe("Resume download dialog", () => {
  const openSpy = jest.fn();

  beforeEach(() => {
    openSpy.mockReset();
    jest.spyOn(window, "open").mockImplementation(openSpy);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("validates required fields before allowing the CV download", async () => {
    const user = userEvent.setup();
    render(<IntroductionActions actions={introductionContent.actions} />);

    await user.click(screen.getByRole("button", { name: /download cv/i }));
    await user.click(screen.getByRole("button", { name: /download cv/i }));

    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Please share a little more context.")).toBeInTheDocument();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("opens the resume in a new tab after a valid request", async () => {
    const user = userEvent.setup();
    render(<IntroductionActions actions={introductionContent.actions} />);

    await user.click(screen.getByRole("button", { name: /download cv/i }));
    await user.type(screen.getByLabelText(/full name/i), "Viraj Nikam");
    await user.type(screen.getByLabelText(/email address/i), "viraj@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "I would like to review your frontend experience for a role."
    );
    await user.click(screen.getAllByRole("button", { name: /download cv/i }).at(-1)!);

    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledWith(
        introductionContent.actions.resume.fileUrl,
        "_blank",
        "noopener,noreferrer"
      );
    });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
