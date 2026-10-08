export default function Section({ books, sectionType, isHardcoverOnly }) {
  const visibleBooks = Array.isArray(books)
    ? isHardcoverOnly
      ? books.filter((book) => book && book.type === "Hardcover")
      : books
    : [];

  const heading = `${isHardcoverOnly ? "Hardcover " : ""}Books owned by ${
    sectionType === "adults" ? "Adults" : "Children"
  }`;

  return (
    <section aria-label={heading}>
      <h2>{heading}</h2>
      {visibleBooks.length === 0 ? (
        <p>No books available for this selection.</p>
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
