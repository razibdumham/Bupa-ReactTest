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
    vi.mocked(fetchBooks).mockResolvedValue(books);

    const { result } = renderHook(() => useBooks());

    expect(result.current).toMatchObject({
      books: [],
      loading: true,
      error: "",
    });

    await waitFor(() => {
      expect(result.current).toMatchObject({ books, loading: false, error: "" });
    });

    expect(fetchBooks).toHaveBeenCalledOnce();
    expect(fetchBooks.mock.calls[0][0]).toBeInstanceOf(AbortSignal);
    expect(result.current.refetch).toEqual(expect.any(Function));
  });

  it("fetches fresh books when refetch is called", async () => {
    const initialBooks = [{ age: 25, books: [{ name: "Old", type: "Book" }] }];
    const refreshedBooks = [
      { age: 25, books: [{ name: "Fresh", type: "Book" }] },
    ];
    vi.mocked(fetchBooks)
      .mockResolvedValueOnce(initialBooks)
      .mockResolvedValueOnce(refreshedBooks);

    const { result } = renderHook(() => useBooks());

    await waitFor(() => {
      expect(result.current.books).toEqual(initialBooks);
    });

    act(() => {
      result.current.refetch();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current).toMatchObject({
        books: refreshedBooks,
        loading: false,
        error: "",
      });
    });

    expect(fetchBooks).toHaveBeenCalledTimes(2);
  });

  it("exposes a request error and finishes loading", async () => {
    vi.mocked(fetchBooks).mockRejectedValue(new Error("Service unavailable"));

    const { result } = renderHook(() => useBooks());

    await waitFor(() => {
      expect(result.current).toMatchObject({
        books: [],
        loading: false,
        error: "Service unavailable",
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

    expect(result.current).toMatchObject({ books: [], loading: true, error: "" });
  });
});
