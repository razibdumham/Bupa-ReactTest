import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";
import { useBooks } from "./hooks/useBooks.js";

vi.mock("./hooks/useBooks.js", () => ({
  useBooks: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("App", () => {
  it("shows a loading message while books are loading", () => {
    vi.mocked(useBooks).mockReturnValue({
      books: [],
      loading: true,
      error: "",
      warning: "",
    });

    render(<App />);

    expect(screen.getByText("Loading books...")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Books owned by Adults" }),
    ).not.toBeInTheDocument();
  });

  it("shows an error instead of the book sections when loading fails", () => {
    const refetch = vi.fn();
    vi.mocked(useBooks).mockReturnValue({
      books: [],
      loading: false,
      error: "Could not load books.",
      warning: "",
      refetch,
    });

    render(<App />);

    expect(screen.getByRole("alert")).toHaveTextContent("Could not load books.");
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(refetch).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole("heading", { name: "Books owned by Adults" }),
    ).not.toBeInTheDocument();
  });

  it("groups books into adult and children sections and filters by hardcover", () => {
    vi.mocked(useBooks).mockReturnValue({
      books: [
        {
          age: 35,
          books: [
            { name: "Adult Hardcover", type: "Hardcover" },
            { name: "Adult Paperback", type: "Paperback" },
          ],
        },
        {
          age: 18,
          books: [{ name: "Age 18 Adult", type: "Hardcover" }],
        },
        {
          age: 17,
          books: [
            { name: "Child Hardcover", type: "Hardcover" },
            { name: "Child Paperback", type: "Paperback" },
          ],
        },
      ],
      loading: false,
      error: "",
      warning: "",
    });

    render(<App />);

    expect(screen.getByText("Adult Hardcover")).toBeInTheDocument();
    expect(screen.getByText("Adult Paperback")).toBeInTheDocument();
    expect(screen.getByText("Age 18 Adult")).toBeInTheDocument();
    expect(screen.getByText("Child Hardcover")).toBeInTheDocument();
    expect(screen.getByText("Child Paperback")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Hardcover only" }));

    expect(screen.getByText("Adult Hardcover")).toBeInTheDocument();
    expect(screen.queryByText("Adult Paperback")).not.toBeInTheDocument();
    expect(screen.getByText("Child Hardcover")).toBeInTheDocument();
    expect(screen.queryByText("Child Paperback")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Hardcover Books owned by Adults" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Get Books" }));

    expect(screen.getByText("Adult Paperback")).toBeInTheDocument();
    expect(screen.getByText("Child Paperback")).toBeInTheDocument();
  });

  it("shows a warning and keeps valid book sections visible", () => {
    vi.mocked(useBooks).mockReturnValue({
      books: [{ age: 17, books: [{ name: "Valid book", type: "Hardcover" }] }],
      loading: false,
      error: "",
      warning:
        "Some book owners were skipped because their books data is missing or invalid.",
    });

    render(<App />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Some book owners were skipped because their books data is missing or invalid.",
    );
    expect(screen.getByText("Valid book")).toBeInTheDocument();
  });
});
