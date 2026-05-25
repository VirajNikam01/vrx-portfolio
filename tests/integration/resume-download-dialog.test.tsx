import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IntroductionActions } from "@/features/introduction/components/introduction-actions";
import { introductionContent } from "@/config/introduction";

describe("Resume download dialog", () => {
  const openSpy = jest.fn();
  const fetchSpy = jest.fn();

  beforeEach(() => {
    openSpy.mockReset();
    jest.spyOn(window, "open").mockImplementation(openSpy);
    fetchSpy.mockReset();
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: "inquiry-id",
          resumeUrl: "https://storage.example.com/signed-resume-url",
        },
      }),
    });
    global.fetch = fetchSpy;
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
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
    expect(fetchSpy.mock.calls[0][0]).toBe("/api/inquiries");
    expect(fetchSpy.mock.calls[0][1]).toMatchObject({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body)).toEqual({
      source: "resume_download",
      name: "Viraj Nikam",
      email: "viraj@example.com",
      reason: "I would like to review your frontend experience for a role.",
    });
    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledWith(
        "https://storage.example.com/signed-resume-url",
        "_blank",
        "noopener,noreferrer"
      );
    });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("keeps the dialog open when the request cannot be submitted", async () => {
    const user = userEvent.setup();
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Unable to submit inquiry right now." }),
    });
    render(<IntroductionActions actions={introductionContent.actions} />);

    await user.click(screen.getByRole("button", { name: /download cv/i }));
    await user.type(screen.getByLabelText(/full name/i), "Viraj Nikam");
    await user.type(screen.getByLabelText(/email address/i), "viraj@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "I would like to review your frontend experience for a role."
    );
    await user.click(screen.getAllByRole("button", { name: /download cv/i }).at(-1)!);

    expect(
      await screen.findByText("Unable to submit inquiry right now.")
    ).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("shows server field errors through the form state", async () => {
    const user = userEvent.setup();
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Invalid email address.",
        issues: {
          email: ["Please use a non-temporary email address."],
        },
      }),
    });
    render(<IntroductionActions actions={introductionContent.actions} />);

    await user.click(screen.getByRole("button", { name: /download cv/i }));
    await user.type(screen.getByLabelText(/full name/i), "Viraj Nikam");
    await user.type(screen.getByLabelText(/email address/i), "viraj@mailinator.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "I would like to review your frontend experience for a role."
    );
    await user.click(screen.getAllByRole("button", { name: /download cv/i }).at(-1)!);

    expect(
      await screen.findByText("Please use a non-temporary email address.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Invalid email address.")).not.toBeInTheDocument();
    expect(openSpy).not.toHaveBeenCalled();
  });
});
