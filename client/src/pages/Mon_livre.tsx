import "../styles/Mon_livre.css";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddExemplaire from "../components/AddExemplaire";
import EditBookModal from "../components/EditBookModal";
import Header from "../components/Header";
import Student from "../components/Student";
import { useAuth } from "../context/AuthContext";

interface Exemplaire {
  id_exemplaire: number;
  id_eleve: number;
  nom: string;
  prenom: string;
  date_retour: string;
}

function Mon_livre() {
  const { userId, setUserId } = useAuth();
  const location = useLocation();
  const { titre, auteur, livre_resume, couverture_img, ISBN13 } =
    location.state || {};
  const navigate = useNavigate();
  const book = { titre, auteur, livre_resume, couverture_img, ISBN13 };
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddExemplaireModal, setShowAddExemplaireModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);
  const [nbAvailableExemplairesByISBN13, setNbAvailableExemplairesByISBN13] =
    useState(0);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [exemplairesByISBN13, setExemplairesByISBN13] = useState<Exemplaire[]>(
    [],
  );
  const [borrowedExemplairesByISBN13, setBorrowedExemplairesByISBN13] =
    useState<Exemplaire[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    /*Récupération des exemplaires du livre*/
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    const fetchExemplairesByISBN13 = async () => {
      try {
        const response = await fetch(
          `http://localhost:3310/api/${userId}/exemplaires?ISBN13=${ISBN13}`,
        );
        const data = await response.json();
        setExemplairesByISBN13(data);
        const available = data.filter(
          (exemplaire: { isAvailable: boolean }) => exemplaire.isAvailable,
        ).length;
        setNbAvailableExemplairesByISBN13(available);
      } catch (error) {
        console.error("Erreur lors de la récupération des exemplaires:", error);
      }
    };

    /*Récupération des exemplaires empruntés du livre*/
    const fetchBorrowedExemplairesByISBN13 = async () => {
      try {
        const response = await fetch(
          `http://localhost:3310/api/${userId}/exemplaires_borrowed/${ISBN13}`,
        );
        const data = await response.json();
        setBorrowedExemplairesByISBN13(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des exemplaires empruntés:",
          error,
        );
      }
    };

    fetchExemplairesByISBN13();
    fetchBorrowedExemplairesByISBN13();
  }, [userId, ISBN13, setUserId]);

  /*Gère le retour à la page précédente*/
  const handleBackClick = () => {
    navigate(-1);
  };

  /*Gère l'affichage de la modale d'emprunt*/
  const handleAddBorrowClick = () => {
    setShowBorrowModal(true);
    console.info(showBorrowModal);
  };

  /*Gère l'ouvezrture et la fermeture de la modale d'emprunt*/
  const handleEditClick = () => {
    setShowEditModal(true);
  };
  const handleModalClose = () => {
    setShowEditModal(false);
  };

  /*Gère la mise à jour du livre*/
  const handleBookUpdated = (updatedBook: {
    ISBN13: string;
    titre: string;
    auteur: string;
    livre_resume: string;
    couverture_img: string;
  }) => {
    setCurrentBook(updatedBook);
  };

  /*Gère l'ouverture et la fermture de la modale d'ajout d'exemplaire*/
  const handleAddExemplaireClick = () => {
    setShowAddExemplaireModal(true);
  };
  const handleAddExemplaireModalClose = () => {
    setShowAddExemplaireModal(false);
  };

  /*Gère l'ajout d'un exemplaire*/
  const handleExemplaireAdded = (newExemplaire: Exemplaire) => {
    setExemplairesByISBN13((prevExemplaires) => [
      ...prevExemplaires,
      newExemplaire,
    ]);
    setNbAvailableExemplairesByISBN13((prevAvailable) => prevAvailable + 1);
  };

  return (
    <div>
      <Header />
      <section className="Mon_livre">
        <div>
          <figure className="bookCover_container">
            <img
              className="bookCover_image"
              src={currentBook.couverture_img}
              alt="couverture"
            />
            <button
              type="button"
              className="add_exemplaire_button"
              onClick={handleAddExemplaireClick}
            >
              +
            </button>
          </figure>
        </div>
        <div className="infos_livre">
          <p className="exemplaire">
            {nbAvailableExemplairesByISBN13 > 1
              ? `${nbAvailableExemplairesByISBN13} exemplaires disponibles sur ${exemplairesByISBN13.length}`
              : `${nbAvailableExemplairesByISBN13} exemplaire disponible sur ${exemplairesByISBN13.length}`}
          </p>
          <p className="titre">{currentBook.titre}</p>
          <p className="auteur">De : {currentBook.auteur}</p>
          <p className="isbn">ISBN: {currentBook.ISBN13}</p>
        </div>
      </section>
      <div className={`resume-container ${isExpanded ? "expanded" : ""}`}>
        <p className="resume">{currentBook.livre_resume}</p>
      </div>
      <button type="button" className="read-more-btn" onClick={toggleReadMore}>
        {isExpanded ? "Lire moins" : "Lire la suite"}
      </button>
      <h2 className="h2-detail">Exemplaires empruntés par :</h2>
      <section className="exemplaires-empruntes">
        <ul>
          {borrowedExemplairesByISBN13.map((exemplaire) => (
            <div
              className="borrowed-book-container"
              key={exemplaire.id_exemplaire}
            >
              <Student
                context="mon_livre"
                id_eleve={exemplaire.id_eleve}
                nom={exemplaire.nom}
                prenom={exemplaire.prenom}
                date_retour={exemplaire.date_retour}
                nbOfBooksBorrowed={
                  borrowedExemplairesByISBN13.filter(
                    (e) => e.id_eleve === exemplaire.id_eleve,
                  ).length
                }
              />
            </div>
          ))}
        </ul>
      </section>
      <div className="buttons">
        <button type="button" className="edit_button" onClick={handleEditClick}>
          <img src="/src/assets/images/edit-btn.png" alt="stylo" />
        </button>
        <button
          type="button"
          className="add_borrow_button"
          onClick={handleAddBorrowClick}
        >
          +
        </button>
        <button type="button" className="back_button" onClick={handleBackClick}>
          &#8617;
        </button>
      </div>
      <EditBookModal
        showModal={showEditModal}
        handleModalClose={handleModalClose}
        book={currentBook}
        onBookUpdated={handleBookUpdated}
      />
      {showAddExemplaireModal && (
        <AddExemplaire
          ISBN13={currentBook.ISBN13}
          onExemplaireAdded={handleExemplaireAdded}
          handleModalClose={handleAddExemplaireModalClose}
        />
      )}
    </div>
  );
}

export default Mon_livre;
