import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Section from "./Section.jsx";

afterEach(cleanup);

describe("Section", () => {
  it("renders the books for the section", () => {
    render(
      <Section
        books={[
          { name: "Book One", type: "Hardcover" },
          { name: "Book Two", type: "Paperback" },
        ]}
        sectionType="adults"
        isHardcoverOnly={false}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Books owned by Adults" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Book One")).toBeInTheDocument();
    expect(screen.getByText("Book Two")).toBeInTheDocument();
  });

  it("sorts book names alphabetically without changing the input array", () => {
    const books = [
      { name: "Wuthering Heights", type: "Paperback" },
      { name: "hamlet", type: "Paperback" },
      { name: "Great Expectations", type: "Hardcover" },
    ];

    render(
      <Section books={books} sectionType="adults" isHardcoverOnly={false} />,
    );

    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Great Expectations",
      "hamlet",
      "Wuthering Heights",
    ]);
    expect(books.map((book) => book.name)).toEqual([
      "Wuthering Heights",
      "hamlet",
      "Great Expectations",
    ]);
  });

  it("shows only hardcover books when that filter is active", () => {
    render(
      <Section
        books={[
          { name: "Hardcover Book", type: "Hardcover" },
          { name: "Uppercase Hardcover Book", type: "HARDCOVER" },
          { name: "Lowercase Hardcover Book", type: "hardcover" },
          { name: "Paperback Book", type: "Paperback" },
        ]}
        sectionType="children"
        isHardcoverOnly
      />,
    );

    expect(screen.getByText("Hardcover Book")).toBeInTheDocument();
    expect(screen.getByText("Uppercase Hardcover Book")).toBeInTheDocument();
    expect(screen.getByText("Lowercase Hardcover Book")).toBeInTheDocument();
    expect(screen.queryByText("Paperback Book")).not.toBeInTheDocument();
  });

  it("shows an empty state when there are no matching books", () => {
    render(<Section books={[]} sectionType="adults" isHardcoverOnly={false} />);

    expect(
      screen.getByText("No books available for this selection."),
    ).toBeInTheDocument();
  });
});
