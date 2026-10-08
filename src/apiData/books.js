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

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("The API returned an unexpected response.");
  }

  const validData = data.filter(isValidPerson);

  validData.forEach((person) => {
    person.books = person.books.filter(isValidBook);
  });

  return validData;
}
