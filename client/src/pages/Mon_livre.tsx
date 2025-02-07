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
  const { titre, auteur, livre_resume, couverture_img, ISBN } =
    location.state || {};
  const navigate = useNavigate();
  const book = { titre, auteur, livre_resume, couverture_img, ISBN };
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddExemplaireModal, setShowAddExemplaireModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);
  const [nbAvailableExemplaires, setNbAvailableExemplaires] = useState(0);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [exemplaires, setExemplaires] = useState<Exemplaire[]>([]);
  const [borrowedExemplaires, setBorrowedExemplaires] = useState<Exemplaire[]>(
    [],
  );

  useEffect(() => {
    /*Récupération des exemplaires du livre*/
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    const fetchExemplaires = async () => {
      try {
        const response = await fetch(
          `http://localhost:3310/api/${userId}/exemplaires?ISBN=${ISBN}`,
        );
        const data = await response.json();
        setExemplaires(data);
        const available = data.filter(
          (exemplaire: { isAvailable: boolean }) => exemplaire.isAvailable,
        ).length;
        setNbAvailableExemplaires(available);
      } catch (error) {
        console.error("Erreur lors de la récupération des exemplaires:", error);
      }
    };

    /*Récupération des exemplaires empruntés du livre*/
    const fetchBorrowedExemplairesByISBN = async () => {
      try {
        const response = await fetch(
          `http://localhost:3310/api/${userId}/exemplaires_borrowed/${ISBN}`,
        );
        const data = await response.json();
        setBorrowedExemplaires(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des exemplaires empruntés:",
          error,
        );
      }
    };

    fetchExemplaires();
    fetchBorrowedExemplairesByISBN();
  }, [userId, ISBN, setUserId]);

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
    ISBN: string;
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
    setExemplaires((prevExemplaires) => [...prevExemplaires, newExemplaire]);
    setNbAvailableExemplaires((prevAvailable) => prevAvailable + 1);
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
            {nbAvailableExemplaires > 1
              ? `${nbAvailableExemplaires} exemplaires disponibles sur ${exemplaires.length}`
              : `${nbAvailableExemplaires} exemplaire disponible sur ${exemplaires.length}`}
          </p>
          <p className="titre">{currentBook.titre}</p>
          <p className="auteur">De : {currentBook.auteur}</p>
          <p className="isbn">ISBN: {currentBook.ISBN}</p>
          <p className="resume">{currentBook.livre_resume}</p>
        </div>
      </section>
      <h2 className="h2-detail">Exemplaires empruntés par :</h2>
      <ul>
        {borrowedExemplaires.map((exemplaire) => (
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
                borrowedExemplaires.filter(
                  (e) => e.id_eleve === exemplaire.id_eleve,
                ).length
              }
            />
          </div>
        ))}
      </ul>

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
          ISBN={currentBook.ISBN}
          onExemplaireAdded={handleExemplaireAdded}
          handleModalClose={handleAddExemplaireModalClose}
        />
      )}
    </div>
  );
}

export default Mon_livre;
