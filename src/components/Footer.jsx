export default function Footer({
  onClickGetAllBooks,
  onClickGetHardcoverBooks,
}) {
  return (
    <footer>
      <a href="#" onClick={onClickGetHardcoverBooks}>
        Hardcover only
      </a>
      <button onClick={onClickGetAllBooks}>Get Books</button>
    </footer>
  );
}
