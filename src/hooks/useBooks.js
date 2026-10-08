import { useCallback, useEffect, useState } from "react";
import { fetchBooks } from "../apiData/books.js";

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState(0);

  const refetch = useCallback(() => {
    setLoading(true);
    setError("");
    setRequestId((currentRequestId) => currentRequestId + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setBooks(await fetchBooks(controller.signal));
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Could not load books.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => controller.abort();
  }, [requestId]);

  return { books, loading, error, refetch };
}
