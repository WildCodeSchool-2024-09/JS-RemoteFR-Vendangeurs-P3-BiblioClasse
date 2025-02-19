import { useEffect, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link, useNavigate } from "react-router-dom";

import "../styles/Book.css";
import "../styles/BurgerMenu.css";
import "../styles/Buttons.css";

import Cookies from "js-cookie";
import AddBookManually from "../components/AddBookManually";
import AddBookScan from "../components/AddBookScan";
import Addbook from "../components/Addbook";
import Book from "../components/Book";
import DeleteConfirmationModale from "../components/DeleteConfirmationModale";
import Header from "../components/Header";
import SearchBar from "../components/Searchbar";
import { useAuth } from "../context/AuthContext";

interface BookProps {
  titre: string;
  auteur: string;
  livre_resume: string;
  couverture_img: string;
  ISBN10: string;
  ISBN13: string;
  date_retour?: string;
  nombre_exemplaires: number;
  nombre_exemplaires_disponibles: number;
}

function Ma_bibliotheque() {
  const { userId, setUserId } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookProps[]>([]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [filteredBooks, setFilteredBooks] = useState<BookProps[]>([]);
  const [sortBooks, setSortBooks] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalBook, setShowModalBook] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<BookProps | null>(null);
  const [showDeleteConfirmationModale, setShowDeleteConfirmationModale] =
    useState(false);
  const [showModalScan, setShowModalScan] = useState(false);

  /*Gère le retour à la page précédente*/
  const handleBackClick = () => {
    navigate(-1);
  };

  /*Récupération des livres*/
  useEffect(() => {
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/livres_with_exemplaires`,
        );
        const data = await response.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des livres:", error);
      }
    };

    fetchBooks();
  }, [userId, setUserId]);

  /*Gère l'ouverture et la fermeture du menu tiroir*/
  const handleMenuStateChange = (state: { isOpen: boolean }) => {
    setMenuOpen(state.isOpen);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };

  /*Fonction pour trier les livres par titre ou auteur*/
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBooks === "titre") {
      return a.titre.localeCompare(b.titre);
    }
    if (sortBooks === "auteur") {
      return a.auteur.localeCompare(b.auteur);
    }
    return 0;
  });

  /*Gère l'ouverture et la fermeturer du modal pour ajouter un livre*/
  const handleAddBookClick = () => {
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  /* Gère l'ouverture et la fermeture de la modale d'ajout manuel de livre */
  const handleAddBookManuallyClick = () => {
    setShowModalBook(true);
    setShowModal(false);
  };
  const handleModalBookClose = () => setShowModalBook(false);

  /*Gère l'ouverture et la fermeture de la modale de scan de livre*/
  const handleAddBookScanClick = () => {
    setShowModalScan(true);
    setShowModal(false);
  };

  const handleModalScanClose = () => {
    setShowModalScan(false);
    window.location.reload();
  };

  /*Fonction pour rechercher un livre*/
  const handleSearchClick = (searchTerm: string) => {
    const filtered = books.filter(
      (book) =>
        book.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.auteur.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredBooks(filtered);
  };

  /*Fonction pour mettre à jour l'état des livres après ajout*/
  const handleBookAdded = (newBook: BookProps) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
    setFilteredBooks((prevBooks) => [...prevBooks, newBook]);
  };

  /*Fonction pour éditer la liste*/
  const handleEditListClick = () => {
    setEditMode(!editMode);
    setMenuOpen(false);
  };

  /* Fonction pour afficher la modale de confirmation */
  const handleDeleteConfirmationModale = (book: BookProps) => {
    setBookToDelete(book);
    setShowDeleteConfirmationModale(true);
  };

  /*Fonction pour supprimer un livre*/
  const handleDeleteBook = async (ISBN13: string) => {
    const book = books.find((book) => book.ISBN13 === ISBN13);
    if (book) {
      handleDeleteConfirmationModale(book);
    }
  };

  /* Fonction pour confirmer la suppression */
  const handleConfirmDelete = async () => {
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    if (!bookToDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/${userId}/livres/${bookToDelete.ISBN13}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book.ISBN13 !== bookToDelete.ISBN13),
        );
        setFilteredBooks((prevBooks) =>
          prevBooks.filter((book) => book.ISBN13 !== bookToDelete.ISBN13),
        );
        setShowDeleteConfirmationModale(false);
        setBookToDelete(null);
      } else {
        console.error("Erreur lors de la suppression de l'élève");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'élève:", error);
    }
  };

  /* Fonction pour annuler la suppression */
  const handleCancelDelete = () => {
    setShowDeleteConfirmationModale(false);
    setBookToDelete(null);
  };

  return (
    <div>
      <Header />
      {editMode && (
        <div className="delete-mode-banner">
          <p>Cliquez sur un livre pour le supprimer.</p>
          <button
            onClick={handleEditListClick}
            className="exit-delete-mode-button"
            type="button"
          >
            Quitter le mode suppression
          </button>
        </div>
      )}
      <Menu right isOpen={menuOpen} onStateChange={handleMenuStateChange}>
        <div className="menu-item">
          <button
            onClick={handleEditListClick}
            type="button"
            className="edit-button-bm"
          >
            Modifier la liste
          </button>
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
          <Link to="/accueil" onClick={closeMenu}>
            <strong>Accueil</strong>
          </Link>
        </div>
      </Menu>
      <section className={`Ma_bibliotheque ${editMode ? "edit-mode" : ""}`}>
        {sortedBooks.map((book) => (
          <div
            key={book.ISBN13}
            className={`book-container ${editMode ? "delete-mode" : ""}`}
            onContextMenu={(e) => {
              e.preventDefault();
              if (editMode) {
                handleDeleteBook(book.ISBN13);
              }
            }}
          >
            <Book
              titre={book.titre}
              auteur={book.auteur}
              livre_resume={book.livre_resume}
              couverture_img={book.couverture_img}
              ISBN13={book.ISBN13}
              ISBN10={book.ISBN10}
              date_retour={book.date_retour}
              nombre_exemplaires={book.nombre_exemplaires}
              nombre_exemplaires_disponibles={
                book.nombre_exemplaires_disponibles
              }
              context="bibliotheque"
            />
            {editMode && (
              <button
                type="button"
                className="delete-button"
                onClick={() => handleDeleteBook(book.ISBN13)}
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <DeleteConfirmationModale
          showDeleteConfirmationModale={showDeleteConfirmationModale}
          message={`Êtes-vous sûr de vouloir supprimer ${bookToDelete?.titre} ? Une fois la suppression validée, vous ne pourrez plus revenir en arrière.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </section>
      {!editMode && (
        <div className="buttons">
          <button
            type="button"
            className="add_book_button"
            onClick={handleAddBookClick}
          >
            +
          </button>
          {/* Modale pour ajouter un livre */}
          <Addbook
            showModal={showModal}
            handleModalClose={handleModalClose}
            handleAddBookManuallyClick={handleAddBookManuallyClick}
            handleAddBookScanClick={handleAddBookScanClick}
          />
          {/* Modale pour ajouter un livre manuellement */}
          <AddBookManually
            showModalBook={showModalBook}
            handleModalBookClose={handleModalBookClose}
            handleBookAdded={handleBookAdded}
          />
          {/* Modale pour scanner un livre */}
          <AddBookScan
            showModalScan={showModalScan}
            handleModalScanClose={handleModalScanClose}
            handleBookAdded={handleBookAdded}
          />
          <button
            type="button"
            className="back_button_bibliotheque"
            onClick={handleBackClick}
          >
            &#8617;
          </button>
          <button
            type="button"
            className="search_button"
            onClick={() => handleSearchClick("")}
          >
            <img src="/src/assets/images/loupe.png" alt="loupe" />
          </button>
          <SearchBar onSearch={handleSearchClick} />
        </div>
      )}
    </div>
  );
}

export default Ma_bibliotheque;
