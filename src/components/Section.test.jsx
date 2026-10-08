import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Section from "./Section.jsx";

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

  it("shows only hardcover books when that filter is active", () => {
    render(
      <Section
        books={[
          { name: "Hardcover Book", type: "Hardcover" },
          { name: "Paperback Book", type: "Paperback" },
        ]}
        sectionType="children"
        isHardcoverOnly
      />,
    );

    expect(screen.getByText("Hardcover Book")).toBeInTheDocument();
    expect(screen.queryByText("Paperback Book")).not.toBeInTheDocument();
  });

  it("shows an empty state when there are no matching books", () => {
    render(<Section books={[]} sectionType="adults" isHardcoverOnly={false} />);

    expect(
      screen.getByText("No books available for this selection."),
    ).toBeInTheDocument();
  });
});
