export default function Section({ books, sectionType, isHardcoverOnly }) {
  const visibleBooks = isHardcoverOnly
    ? books.filter((book) => book.type === "Hardcover")
    : books;

  return (
    <section>
      <h2>
        {isHardcoverOnly ? "Hardcover " : ""} Books owned by{" "}
        {sectionType === "adults" ? "Adults" : "Children"}
      </h2>
      <ul>
        {visibleBooks.map((book) => (
          <li key={book.name}>{book.name}</li>
        ))}
      </ul>
    </section>
  );
}
