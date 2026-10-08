export default function Footer({
  onClickGetAllBooks,
  onClickGetHardcoverBooks,
}) {
  function handleHardcoverClick(event) {
    event.preventDefault();
    onClickGetHardcoverBooks();
  }

  return (
    <footer>
      <a href="#" onClick={handleHardcoverClick}>
        Hardcover only
      </a>
      <button type="button" onClick={onClickGetAllBooks}>
        Get Books
      </button>
    </footer>
  );
}
