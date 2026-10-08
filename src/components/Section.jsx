export default function Section({ books, sectionType, isHardcoverOnly }) {
  const visibleBooks = (Array.isArray(books) ? books : [])
    .filter(
      (book) =>
        !isHardcoverOnly ||
        (typeof book?.type === "string" &&
          book.type.toLowerCase() === "hardcover"),
    )
    .sort((first, second) =>
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
