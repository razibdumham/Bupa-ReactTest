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
        onToggleHardcover={vi.fn()}
      />,
    );
    const filter = screen.getByRole("button", { name: "Hardcover only" });

    expect(filter).toHaveAttribute("aria-pressed", "false");

    rerender(
      <Footer
        isHardcoverOnly
        onClickGetAllBooks={vi.fn()}
        onToggleHardcover={vi.fn()}
      />,
    );

    expect(filter).toHaveAttribute("aria-pressed", "true");
  });

  it("calls the hardcover toggle callback", () => {
    const onToggleHardcover = vi.fn();
    render(
      <Footer
        isHardcoverOnly={false}
        onClickGetAllBooks={vi.fn()}
        onToggleHardcover={onToggleHardcover}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Hardcover only" }));

    expect(onToggleHardcover).toHaveBeenCalledOnce();
  });

  it("calls the get-books callback when its button is clicked", () => {
    const onClickGetAllBooks = vi.fn();
    render(
      <Footer
        isHardcoverOnly={false}
        onClickGetAllBooks={onClickGetAllBooks}
        onToggleHardcover={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Get Books" }));

    expect(onClickGetAllBooks).toHaveBeenCalledOnce();
  });
});
