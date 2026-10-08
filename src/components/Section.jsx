export default function Section({ books, sectionType, isHardcoverOnly }) {
  const filteredBooks = isHardcoverOnly
    ? books.filter((book) => book.type.toLowerCase() === "hardcover")
    : books;

  const visibleBooks = [];
  const seenBookNames = new Set();

  for (const book of filteredBooks) {
    const normalizedName = book.name.trim().toLowerCase();
    if (seenBookNames.has(normalizedName)) {
      continue;
    }

    seenBookNames.add(normalizedName);
    visibleBooks.push(book);
  }

  visibleBooks.sort((first, second) =>
    first.name.localeCompare(second.name, undefined, {
      sensitivity: "base",
    }),
  );

  const heading = `${isHardcoverOnly ? "Hardcover " : ""} Books owned by ${
    sectionType === "adults" ? "Adults" : "Children"
  }`;

  return (
    <section aria-label={heading}>
      <h2>{heading}</h2>
      {visibleBooks.length === 0 ? (
        <p className="info">No books available for this selection.</p>
      ) : (
        <ul>
          {visibleBooks.map((book) => (
            <li key={book.name.trim().toLowerCase()}>{book.name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
