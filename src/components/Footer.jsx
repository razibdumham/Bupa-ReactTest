export default function Footer({
  onClickGetAllBooks,
  onClickGetHardcoverBooks,
  isHardcoverOnly,
}) {
  function handleHardcoverClick(event) {
    event.preventDefault();
    onClickGetHardcoverBooks();
  }

  return (
    <footer>
      <a href="#" onClick={handleHardcoverClick} aria-pressed={isHardcoverOnly}>
        Hardcover only
      </a>
      <button type="button" onClick={onClickGetAllBooks}>
        Get Books
      </button>
    </footer>
  );
}
