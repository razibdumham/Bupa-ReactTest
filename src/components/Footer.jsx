export default function Footer({
  onClickGetAllBooks,
  onToggleHardcover,
  isHardcoverOnly,
}) {
  return (
    <footer>
      <button
        type="button"
        className="hardcover-filter"
        aria-pressed={isHardcoverOnly}
        onClick={onToggleHardcover}
      >
        Hardcover only
      </button>
      <button type="button" onClick={onClickGetAllBooks}>
        Get Books
      </button>
    </footer>
  );
}
