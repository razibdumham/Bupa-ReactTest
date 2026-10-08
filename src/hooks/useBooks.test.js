import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchBooks } from "../apiData/books.js";
import { useBooks } from "./useBooks.js";

vi.mock("../apiData/books.js", () => ({
  fetchBooks: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useBooks", () => {
  it("starts loading and stores books after a successful request", async () => {
    const books = [{ age: 25, books: [{ name: "Novel", type: "Hardcover" }] }];
    vi.mocked(fetchBooks).mockResolvedValue({ books, warning: "" });

    const { result } = renderHook(() => useBooks());

    expect(result.current).toMatchObject({
      books: [],
      loading: true,
      error: "",
      warning: "",
    });

    await waitFor(() => {
      expect(result.current).toMatchObject({
        books,
        loading: false,
        error: "",
        warning: "",
      });
    });

    expect(fetchBooks).toHaveBeenCalledOnce();
    expect(fetchBooks.mock.calls[0][0]).toBeInstanceOf(AbortSignal);
  });

  it("fetches the books again when refetch is called", async () => {
    const books = [{ age: 25, books: [{ name: "Novel", type: "Hardcover" }] }];
    vi.mocked(fetchBooks).mockResolvedValue({ books, warning: "" });

    const { result } = renderHook(() => useBooks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.refetch();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(fetchBooks).toHaveBeenCalledTimes(2);
      expect(result.current.loading).toBe(false);
    });
  });

  it("exposes a request error and finishes loading", async () => {
    vi.mocked(fetchBooks).mockRejectedValue(new Error("Service unavailable"));

    const { result } = renderHook(() => useBooks());

    await waitFor(() => {
      expect(result.current).toMatchObject({
        books: [],
        loading: false,
        error: "Service unavailable",
        warning: "",
      });
    });
  });

  it("aborts the request when the hook is unmounted", () => {
    let requestSignal;
    vi.mocked(fetchBooks).mockImplementation(
      (signal) =>
        new Promise(() => {
          requestSignal = signal;
        }),
    );

    const { unmount } = renderHook(() => useBooks());

    unmount();

    expect(requestSignal.aborted).toBe(true);
  });

  it("does not update its state when the request is aborted", async () => {
    let rejectRequest;
    vi.mocked(fetchBooks).mockImplementation(
      () =>
        new Promise((resolve) => {
          rejectRequest = (error) => resolve(Promise.reject(error));
        }),
    );

    const { result, unmount } = renderHook(() => useBooks());

    unmount();

    await act(async () => {
      rejectRequest(new Error("Request aborted"));
    });

    expect(result.current).toMatchObject({
      books: [],
      loading: true,
      error: "",
      warning: "",
    });
  });
});
