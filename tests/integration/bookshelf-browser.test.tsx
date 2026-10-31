import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BookshelfBrowser } from "@/app/bookshelf/components/organisms/bookshelf-browser";
import { BookshelfCover } from "@/app/bookshelf/components/molecules/bookshelf-cover";
import type { BookshelfSummary } from "@/shared/contracts/bookshelf";

jest.mock("next/navigation", () => {
    const { useSyncExternalStore } = jest.requireActual("react");
    const subscribe = (callback: () => void) => {
        window.addEventListener("popstate", callback);
        return () => window.removeEventListener("popstate", callback);
    };
    return {
        usePathname: () => useSyncExternalStore(subscribe, () => window.location.pathname),
        useSearchParams: () => new URLSearchParams(useSyncExternalStore(subscribe, () => window.location.search)),
        useRouter: () => mockRouter,
    };
});
const mockRouter = { replace: jest.fn((href: string) => window.history.replaceState(null, "", href)) };

const book: BookshelfSummary = { id: 1, slug: "book", type: "book", title: "A Book", author: "An Author", description: "Context", tags: ["thinking"], coverImageUrl: null };
const paper: BookshelfSummary = { ...book, id: 2, slug: "paper", type: "video", title: "Attention Paper", author: "Researcher" };

beforeEach(() => {
    window.history.replaceState(null, "", "/bookshelf");
    sessionStorage.clear();
    const replace = window.history.replaceState.bind(window.history);
    jest.spyOn(window.history, "replaceState").mockImplementation((data, unused, url) => {
        replace(data, unused, url);
        window.dispatchEvent(new PopStateEvent("popstate"));
    });
    jest.spyOn(window.history, "pushState").mockImplementation(function (data, unused, url) {
        window.history.replaceState(data, unused, url);
        window.dispatchEvent(new PopStateEvent("popstate"));
    });
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

it("filters locally, keeps category counts independent of search, and writes a shareable query", async () => {
    render(<BookshelfBrowser items={[book, paper]}><p>Selected item notes</p></BookshelfBrowser>);
    expect(screen.getByRole("link", { name: "All items 2" })).toHaveAttribute("aria-current", "page");
    for (const category of ["Articles", "Papers", "Movies"]) expect(screen.queryByRole("link", { name: new RegExp(`^${category} `) })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All items 2" })).toHaveClass("bg-primary/10");
    expect(screen.getByRole("navigation", { name: "Bookshelf categories" }).querySelector("[data-active-indicator]")).toBeNull();
    expect(screen.getByRole("link", { name: "Videos 1" })).toHaveAttribute("href", "/bookshelf/paper?type=video");
    act(() => window.history.pushState(null, "", "/bookshelf/paper?type=video"));
    expect(screen.getByRole("link", { name: /Attention Paper/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A Book An Author/ })).not.toBeInTheDocument();
    expect(screen.getByText("Selected item notes")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "missing" } });
    expect(screen.getByText("No items match your search.")).toBeInTheDocument();
    expect(screen.queryByText("Selected item notes")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Videos 1" })).toBeInTheDocument();
    await waitFor(() => expect(window.location.search).toContain("q=missing"));
    fireEvent.click(screen.getAllByRole("button", { name: "Clear search" })[0]);
    await waitFor(() => expect(screen.getByRole("link", { name: /Attention Paper/ })).toBeInTheDocument());
    act(() => window.history.pushState(null, "", "/bookshelf?type=movie"));
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Item notes")).not.toBeInTheDocument();
});

it("restores URL-driven search and selected-item context on direct navigation", () => {
    window.history.replaceState(null, "", "/bookshelf/book?q=thinking");
    render(<BookshelfBrowser items={[book, paper]}><h2>Stored notes</h2></BookshelfBrowser>);
    expect(screen.getByRole("link", { name: "Books 1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("searchbox")).toHaveValue("thinking");
    expect(screen.getByRole("link", { name: "Back to bookshelf" })).toHaveAttribute("href", "/bookshelf?q=thinking");
    expect(screen.getByRole("heading", { name: "Stored notes" })).toBeInTheDocument();
});

it("does not hide not-found or error content when a slug is not in the catalog", () => {
    window.history.replaceState(null, "", "/bookshelf/missing");
    render(<BookshelfBrowser items={[book]}><h2>This item is not on the shelf</h2></BookshelfBrowser>);
    expect(screen.getByRole("heading", { name: "This item is not on the shelf" })).toBeInTheDocument();
});

it("replaces broken artwork with a text cover in the same portrait slot", () => {
    const { container } = render(<BookshelfCover item={{ ...book, coverImageUrl: "https://example.com/missing.jpg" }} />);
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("A Book")).toBeInTheDocument();
    expect(screen.getByText("An Author")).toBeInTheDocument();
});
