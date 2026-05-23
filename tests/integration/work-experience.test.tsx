import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WorkExperience } from "@/features/work-experience/components";
import { workExperiences } from "@/config/work-experience";

describe("WorkExperience UI", () => {
  it("renders company, position, duration, skills, and expanded details", () => {
    render(<WorkExperience experiences={workExperiences} />);

    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Zybra" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /full-stack developer/i })).toBeInTheDocument();
    expect(screen.getByText(/Dec 2024 - Present/i)).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText(/Building polished web interfaces/i)).toBeInTheDocument();
  });

  it("collapses and expands a position's details from the trigger", async () => {
    const user = userEvent.setup();
    render(<WorkExperience experiences={workExperiences} />);

    const trigger = screen.getByRole("button", { name: /full-stack developer/i });
    const details = screen.getByText(/Building polished web interfaces/i);

    expect(details).toBeVisible();
    await user.click(trigger);
    expect(details).not.toBeVisible();
    await user.click(trigger);
    expect(screen.getByText(/Building polished web interfaces/i)).toBeVisible();
  });
});
