import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchBooks } from "./books.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockResponse({ status = 200, body = "", ok = status < 400 } = {}) {
  return {
    status,
    ok,
    text: vi.fn().mockResolvedValue(body),
  };
}

describe("fetchBooks", () => {
  it("requests book owners and removes malformed people and books", async () => {
    const response = mockResponse({
      body: JSON.stringify([
        {
          age: 30,
          name: "Alex",
          books: [
            { name: "Valid book", type: "Hardcover" },
            { name: "Missing type" },
            null,
          ],
        },
        { age: "17", books: [] },
        null,
      ]),
    });
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetchMock);
    const controller = new AbortController();

    await expect(fetchBooks(controller.signal)).resolves.toEqual([
      {
        age: 30,
        name: "Alex",
        books: [{ name: "Valid book", type: "Hardcover" }],
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith("/api/v1/bookowners", {
      signal: controller.signal,
    });
  });

  it("normalizes API field names regardless of capitalization", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        mockResponse({
          body: JSON.stringify([
            {
              NAME: "Charles",
              AGE: 17,
              BOOKS: [
                { NAME: "Little Red Riding Hood", TYPE: "Hardcover" },
                { NAME: "The Hobbit", TYPE: "Ebook" },
              ],
            },
            {
              name: "William",
              Age: 15,
              bOoKs: [
                { nAmE: "Great Expectations", tYpE: "Hardcover" },
              ],
            },
          ]),
        }),
      ),
    );

    await expect(fetchBooks()).resolves.toEqual([
      {
        NAME: "Charles",
        AGE: 17,
        BOOKS: [
          { NAME: "Little Red Riding Hood", TYPE: "Hardcover" },
          { NAME: "The Hobbit", TYPE: "Ebook" },
        ],
        name: "Charles",
        age: 17,
        books: [
          {
            NAME: "Little Red Riding Hood",
            TYPE: "Hardcover",
            name: "Little Red Riding Hood",
            type: "Hardcover",
          },
          {
            NAME: "The Hobbit",
            TYPE: "Ebook",
            name: "The Hobbit",
            type: "Ebook",
          },
        ],
      },
      {
        name: "William",
        Age: 15,
        bOoKs: [{ nAmE: "Great Expectations", tYpE: "Hardcover" }],
        age: 15,
        books: [
          {
            nAmE: "Great Expectations",
            tYpE: "Hardcover",
            name: "Great Expectations",
            type: "Hardcover",
          },
        ],
      },
    ]);
  });

  it("reports a rate limit response body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        mockResponse({ status: 429, ok: false, body: "Try again later" }),
      ),
    );

    await expect(fetchBooks()).rejects.toThrow("Try again later");
  });

  it("uses a fallback message when the rate limit response is empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(mockResponse({ status: 429, ok: false })),
    );

    await expect(fetchBooks()).rejects.toThrow("Too many requests.");
  });

  it("reports other unsuccessful HTTP responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        mockResponse({ status: 503, ok: false, body: "Unavailable" }),
      ),
    );

    await expect(fetchBooks()).rejects.toThrow("Request failed: 503");
  });

  it("rejects empty and invalid JSON responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse()));
    await expect(fetchBooks()).rejects.toThrow(
      "The books API returned an empty response.",
    );

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(mockResponse({ body: "{invalid json" })),
    );
    await expect(fetchBooks()).rejects.toThrow(
      "The books API returned invalid JSON.",
    );
  });

  it("rejects a valid JSON response that is not an array", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(mockResponse({ body: '{"books":[]}' })),
    );

    await expect(fetchBooks()).rejects.toThrow(
      "The API returned an unexpected response.",
    );
  });
});
