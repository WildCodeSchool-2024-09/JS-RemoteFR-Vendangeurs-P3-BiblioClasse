import { useEffect, useState } from "react";
import Book from "../components/Book";
import Header from "../components/Header";
import "../styles/Book.css";
import { slide as Menu } from "react-burger-menu";
import "../styles/BurgerMenu.css";
import { Link } from "react-router-dom";
import "../styles/Buttons.css";
import AddBookManually from "../components/AddBookManually";
import Addbook from "../components/Addbook";
import SearchBar from "../components/Searchbar";

interface BookProps {
  titre: string;
  auteur: string;
  livre_resume: string;
  couverture_img: string;
  ISBN: string;
}

function Ma_bibliotheque() {
  const [books, setBooks] = useState<BookProps[]>([]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [filteredBooks, setFilteredBooks] = useState<BookProps[]>([]);
  const [sortBooks, setSortBooks] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalBook, setShowModalBook] = useState<boolean>(false);

  useEffect(() => {
    // Faire une requête à l'API pour récupérer les livres
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:3310/api/livres");
        const data = await response.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des livres:", error);
      }
    };

    fetchBooks();
  }, []);

  /*Gère l'ouverture du menu tiroir*/
  const handleMenuStateChange = (state: { isOpen: boolean }) => {
    setMenuOpen(state.isOpen);
  };
  /*Gère la fermeture du menu tiroir*/
  const closeMenu = () => {
    setMenuOpen(false);
  };

  /*Fonction pour ajouter un livre*/
  const handleAddBookClick = () => {
    setShowModal(true);
    console.info("Add book");
  };

  /*Gère l'ouverture de la modale*/
  const handleModalClose = () => {
    setShowModal(false);
  };

  /* Gère l'ouverture de la modale 2 */
  const handleAddBookManuallyClick = () => {
    setShowModalBook(true);
    setShowModal(false);
  };

  /*Gère la fermeture de la modale 2 */
  const handleModalBookClose = () => setShowModalBook(false);

  /*Fonction pour trier les livres*/
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBooks === "titre") {
      return a.titre.localeCompare(b.titre);
    }
    if (sortBooks === "auteur") {
      return a.auteur.localeCompare(b.auteur);
    }
    return 0;
  });

  /*Fonction pour rechercher un livre*/
  const handleSearchClick = (searchTerm: string) => {
    const filtered = books.filter((book) =>
      book.titre.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredBooks(filtered);
  };

  /*Fonction pour mettre à jour l'état des livres*/
  const handleBookAdded = (newBook: BookProps) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
    setFilteredBooks((prevBooks) => [...prevBooks, newBook]);
  };

  return (
    <div>
      <Header />
      <Menu right isOpen={menuOpen} onStateChange={handleMenuStateChange}>
        <div className="menu-item">
          <strong>Editer la liste</strong>
        </div>
        <div className="menu-item">
          <strong>Trier par :</strong>
        </div>
        <div className="menu-item">
          <label className="radio">
            <input
              type="radio"
              name="sort"
              value="titre"
              checked={sortBooks === "titre"}
              onChange={() => {
                setSortBooks("titre");
                closeMenu();
              }}
            />
            Trier par titre
          </label>
        </div>
        <div className="menu-item">
          <label className="radio">
            <input
              type="radio"
              name="sort"
              value="auteur"
              checked={sortBooks === "auteur"}
              onChange={() => {
                setSortBooks("auteur");
                closeMenu();
              }}
            />
            Trier par auteur
          </label>
        </div>
        <div className="menu-item">
          <Link to="/" onClick={closeMenu}>
            <strong>Accueil</strong>
          </Link>
        </div>
        <div className="menu-item">
          <strong>Paramètres</strong>
        </div>
        <div className="menu-item">
          <strong>Se déconnecter</strong>
        </div>
      </Menu>
      <section className="Ma_bibliotheque">
        {sortedBooks.map((book) => (
          <Book
            key={book.ISBN}
            titre={book.titre}
            auteur={book.auteur}
            resume={book.livre_resume}
            couverture_img={book.couverture_img}
            ISBN={book.ISBN}
          />
        ))}
      </section>
      <div className="buttons">
        <button
          type="button"
          className="add_book_button"
          onClick={handleAddBookClick}
        >
          +
        </button>
      </div>
      {/* Modale pour ajouter un livre */}
      <Addbook
        showModal={showModal}
        handleModalClose={handleModalClose}
        handleAddBookManuallyClick={handleAddBookManuallyClick} // Fonction pour ouvrir la modale enfant
      />
      {/* Modale pour ajouter un livre manuellement */}
      <AddBookManually
        showModalBook={showModalBook}
        handleModalBookClose={handleModalBookClose}
        onBookAdded={handleBookAdded}
      />
      <button
        type="button"
        className="search_button"
        onClick={() => handleSearchClick("")}
      >
        <img src="/src/assets/images/loupe.png" alt="loupe" />
      </button>
      <SearchBar onSearch={handleSearchClick} />
    </div>
  );
}

export default Ma_bibliotheque;
