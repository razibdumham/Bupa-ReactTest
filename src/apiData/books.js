export async function fetchBooks(signal) {
  const response = await fetch("/api/v1/bookowners", {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("The API returned an unexpected response.");
  }

  return data;
}
