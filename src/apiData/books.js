function normalizeKeys(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeKeys);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key.toLowerCase(),
        normalizeKeys(nestedValue),
      ]),
    );
  }

  return value;
}

function isValidBook(book) {
  return (
    book &&
    typeof book === "object" &&
    typeof book.name === "string" &&
    typeof book.type === "string"
  );
}

function isValidPerson(person) {
  return (
    person &&
    typeof person === "object" &&
    typeof person.age === "number" &&
    Array.isArray(person.books)
  );
}

export async function fetchBooks(signal) {
  const response = await fetch("/api/v1/bookowners", {
    signal,
  });

  if (response.status === 429) {
    const responseBody = (await response.text()).trim();
    throw new Error(responseBody || "Too many requests.");
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const responseBody = await response.text();

  if (!responseBody.trim()) {
    throw new Error(
      "The books API returned an empty response. Please try again.",
    );
  }

  let data;
  try {
    data = normalizeKeys(JSON.parse(responseBody));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        "The books API returned invalid JSON. Please try again.",
        { cause: error },
      );
    }

    throw error;
  }

  if (!Array.isArray(data)) {
    throw new Error("The API returned an unexpected response.");
  }

  return data.filter(isValidPerson).map((person) => ({
    ...person,
    books: person.books.filter(isValidBook),
  }));
}
