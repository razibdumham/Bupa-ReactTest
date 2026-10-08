import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Section from "./components/Section.jsx";
import { useBooks } from "./hooks/useBooks.js";
function App() {
  const { books, loading, error } = useBooks();

  //console.log(books);
  //console.log(loading);
  // console.log(error);
  return (
    <>
      <Header />
      <main>
        {loading && <p>Loading books...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && <Section books={books} />}
        <Footer />
      </main>
    </>
  );
}

export default App;
