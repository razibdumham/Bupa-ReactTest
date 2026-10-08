import { useState } from "react";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Section from "./components/Section.jsx";
import { useBooks } from "./hooks/useBooks.js";
function App() {
  const [isHardcoverOnly, setIsHardcoverOnly] = useState(false);
  const { books, loading, error } = useBooks();

  function getBooksOwnedByAdults(data) {
    return data
      .filter((person) => person.age > 17) // keep only age > 17
      .flatMap((person) => person.books); // extract all book objects
  }

  function getBooksOwnedByChildren(data) {
    return data
      .filter((person) => person.age <= 17) // keep only age <= 17
      .flatMap((person) => person.books); // extract all book objects
  }

  function handleGetAllBooks() {
    setIsHardcoverOnly(false);
  }

  function handleGetHardcoverBooks() {
    setIsHardcoverOnly(true);
  }

  //console.log(books);
  //console.log(loading);
  // console.log(error);
  return (
    <>
      <Header />
      <main>
        {loading && <p>Loading books...</p>}
        {error && <p role="alert">{error}</p>}
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
          onClickGetAllBooks={handleGetAllBooks}
          onClickGetHardcoverBooks={handleGetHardcoverBooks}
        />
      </main>
    </>
  );
}

export default App;
