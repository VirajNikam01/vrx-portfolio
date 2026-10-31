import { render, screen } from "@testing-library/react";
import { NavigationLink } from "@/app/components/molecules/navigation-link";
import { AdminNavigation } from "@/app/admin/components/organisms/admin-navigation";

let mockPathname = "/";
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname }));

it.each(["/bookshelf", "/bookshelf/a-book", "/recommendations/a-book/chapter"])("marks the Bookshelf section active at %s", pathname => {
    mockPathname = pathname;
    render(<NavigationLink href="/bookshelf" activePaths={["/recommendations"]}>Bookshelf</NavigationLink>);
    const link = screen.getByRole("link", { name: "Bookshelf" });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("font-bold", "text-primary");
    expect(link.querySelector("[data-active-indicator]")).toHaveAttribute("aria-hidden", "true");
});

it.each(["/", "/bookshelf-other"])("does not highlight unrelated route %s", pathname => {
    mockPathname = pathname;
    render(<NavigationLink href="/bookshelf">Bookshelf</NavigationLink>);
    const link = screen.getByRole("link");
    expect(link).not.toHaveAttribute("aria-current");
    expect(link.querySelector("[data-active-indicator]")).toBeNull();
});

it("supports an exact overview link and explicit query-based category state", () => {
    mockPathname = "/admin/bookshelf/new";
    render(<><NavigationLink href="/admin" exact>Overview</NavigationLink><NavigationLink href="/admin/bookshelf">Bookshelf</NavigationLink><NavigationLink href="/bookshelf?type=paper" active={false}>Papers</NavigationLink></>);
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Bookshelf" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Papers" })).not.toHaveAttribute("aria-current");
});

it("uses a background without a dot for active admin navigation", () => {
    mockPathname = "/admin/bookshelf/new";
    render(<AdminNavigation />);
    const link = screen.getByRole("link", { name: "Bookshelf" });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("bg-primary/10", "font-bold", "text-primary");
    expect(link.querySelector("[data-active-indicator]")).toBeNull();
});
