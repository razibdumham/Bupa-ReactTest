export default function Section({ books, sectionType, isHardcoverOnly }) {
  const visibleBooks = [];
  const seenBookNames = new Set();

  for (const book of Array.isArray(books) ? books : []) {
    const isHardcover =
      typeof book?.type === "string" &&
      book.type.toLowerCase() === "hardcover";
    if (isHardcoverOnly && !isHardcover) {
      continue;
    }

    const normalizedName =
      typeof book?.name === "string" ? book.name.trim().toLowerCase() : "";
    if (normalizedName && seenBookNames.has(normalizedName)) {
      continue;
    }

    if (normalizedName) {
      seenBookNames.add(normalizedName);
    }
    visibleBooks.push(book);
  }

  visibleBooks.sort((first, second) =>
    (first?.name ?? "").localeCompare(second?.name ?? "", undefined, {
      sensitivity: "base",
    }),
  );

  const heading = `${isHardcoverOnly && visibleBooks.length > 0 ? "Hardcover " : ""}Books owned by ${
    sectionType === "adults" ? "Adults" : "Children"
  }`;

  return (
    <section aria-label={heading}>
      <h2>{heading}</h2>
      {visibleBooks.length === 0 ? (
        <p className="info">No books available for this selection.</p>
      ) : (
        <ul>
          {visibleBooks.map((book, index) => (
            <li key={`${book?.name ?? "book"}-${index}`}>
              {book?.name ?? "Unnamed book"}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
