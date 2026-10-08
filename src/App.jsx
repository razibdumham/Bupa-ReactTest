import { useState } from "react";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Section from "./components/Section.jsx";
import { useBooks } from "./hooks/useBooks.js";

const ADULT_AGE = 18;

function getBooksOwnedByAgeGroup(owners, isAdult) {
  return owners
    .filter(({ age }) => (isAdult ? age >= ADULT_AGE : age < ADULT_AGE))
    .flatMap(({ books }) => books);
}

function App() {
  const [isHardcoverOnly, setIsHardcoverOnly] = useState(false);
  const { books, loading, error, warning, refetch } = useBooks();

  function handleGetAllBooks() {
    setIsHardcoverOnly(false);
  }

  function handleGetHardcoverBooks() {
    setIsHardcoverOnly(true);
  }

  return (
    <>
      <Header />
      <main>
        {loading && <p aria-live="polite">Loading books...</p>}
        {error && (
          <p className="alert" role="alert">
            {error}{" "}
            <button type="button" onClick={refetch}>
              Retry
            </button>
          </p>
        )}

        {!loading && !error && (
          <Section
            books={getBooksOwnedByAgeGroup(books, true)}
            sectionType="adults"
            isHardcoverOnly={isHardcoverOnly}
          />
        )}
        {!loading && !error && (
          <Section
            books={getBooksOwnedByAgeGroup(books, false)}
            sectionType="children"
            isHardcoverOnly={isHardcoverOnly}
          />
        )}
        {warning && !error && (
          <p className="warning" role="status">
            {warning}{" "}
            <button type="button" onClick={refetch}>
              Retry
            </button>
          </p>
        )}
        <Footer
          isHardcoverOnly={isHardcoverOnly}
          onClickGetAllBooks={handleGetAllBooks}
          onClickGetHardcoverBooks={handleGetHardcoverBooks}
        />
      </main>
    </>
  );
}

export default App;
