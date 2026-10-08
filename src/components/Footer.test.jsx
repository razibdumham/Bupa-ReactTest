import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Footer from "./Footer.jsx";

afterEach(cleanup);

describe("Footer", () => {
  it("reports the hardcover filter state", () => {
    const { rerender } = render(
      <Footer
        isHardcoverOnly={false}
        onClickGetAllBooks={vi.fn()}
        onClickGetHardcoverBooks={vi.fn()}
      />,
    );
    const filter = screen.getByRole("link", { name: "Hardcover only" });

    expect(filter).toHaveAttribute("aria-pressed", "false");

    rerender(
      <Footer
        isHardcoverOnly
        onClickGetAllBooks={vi.fn()}
        onClickGetHardcoverBooks={vi.fn()}
      />,
    );

    expect(filter).toHaveAttribute("aria-pressed", "true");
  });

  it("calls the hardcover filter callback without navigating", () => {
    const onClickGetHardcoverBooks = vi.fn();
    render(
      <Footer
        isHardcoverOnly={false}
        onClickGetAllBooks={vi.fn()}
        onClickGetHardcoverBooks={onClickGetHardcoverBooks}
      />,
    );

    fireEvent.click(screen.getByRole("link", { name: "Hardcover only" }));

    expect(onClickGetHardcoverBooks).toHaveBeenCalledOnce();
    expect(window.location.hash).toBe("");
  });

  it("calls the get-books callback when its button is clicked", () => {
    const onClickGetAllBooks = vi.fn();
    render(
      <Footer
        isHardcoverOnly={false}
        onClickGetAllBooks={onClickGetAllBooks}
        onClickGetHardcoverBooks={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Get Books" }));

    expect(onClickGetAllBooks).toHaveBeenCalledOnce();
  });
});
