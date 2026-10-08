import { useState } from "react";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Section from "./components/Section.jsx";
import { useBooks } from "./hooks/useBooks.js";

function App() {
  const [isHardcoverOnly, setIsHardcoverOnly] = useState(false);
  const { books, loading, error } = useBooks();

  function getBooksOwnedByAdults(data) {
    return (Array.isArray(data) ? data : [])
      .filter(
        (person) => person && typeof person.age === "number" && person.age > 17,
      )
      .flatMap((person) => (Array.isArray(person.books) ? person.books : []));
  }

  function getBooksOwnedByChildren(data) {
    return (Array.isArray(data) ? data : [])
      .filter(
        (person) =>
          person && typeof person.age === "number" && person.age <= 17,
      )
      .flatMap((person) => (Array.isArray(person.books) ? person.books : []));
  }

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
            {error}
          </p>
        )}
        {!loading && !error && (
          <Section
            books={getBooksOwnedByAdults(books)}
            sectionType="adults"
            isHardcoverOnly={isHardcoverOnly}
          />
        )}
        {!loading && !error && (
          <Section
            books={getBooksOwnedByChildren(books)}
            sectionType="children"
            isHardcoverOnly={isHardcoverOnly}
          />
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
