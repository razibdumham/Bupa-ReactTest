function getPropertyIgnoreCase(object, propertyName) {
  const key = Object.keys(object).find(
    (candidate) => candidate.toLowerCase() === propertyName.toLowerCase(),
  );

  return key === undefined ? undefined : object[key];
}

function isValidBook(book) {
  return (
    book &&
    typeof book === "object" &&
    typeof getPropertyIgnoreCase(book, "name") === "string" &&
    typeof getPropertyIgnoreCase(book, "type") === "string"
  );
}

function isValidPerson(person) {
  return (
    person &&
    typeof person === "object" &&
    typeof getPropertyIgnoreCase(person, "age") === "number" &&
    Array.isArray(getPropertyIgnoreCase(person, "books"))
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
    data = JSON.parse(responseBody);
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
    age: getPropertyIgnoreCase(person, "age"),
    name: getPropertyIgnoreCase(person, "name"),
    books: getPropertyIgnoreCase(person, "books")
      .filter(isValidBook)
      .map((book) => ({
        ...book,
        name: getPropertyIgnoreCase(book, "name"),
        type: getPropertyIgnoreCase(book, "type"),
      })),
  }));
}
