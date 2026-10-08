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
    });

    render(<App />);

    expect(screen.getByText("Loading books...")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Books owned by Adults" }),
    ).not.toBeInTheDocument();
  });

  it("shows an error instead of the book sections when loading fails", () => {
    vi.mocked(useBooks).mockReturnValue({
      books: [],
      loading: false,
      error: "Could not load books.",
    });

    render(<App />);

    expect(screen.getByRole("alert")).toHaveTextContent("Could not load books.");
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
          age: 17,
          books: [
            { name: "Child Hardcover", type: "Hardcover" },
            { name: "Child Paperback", type: "Paperback" },
          ],
        },
      ],
      loading: false,
      error: "",
    });

    render(<App />);

    expect(screen.getByText("Adult Hardcover")).toBeInTheDocument();
    expect(screen.getByText("Adult Paperback")).toBeInTheDocument();
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
});
