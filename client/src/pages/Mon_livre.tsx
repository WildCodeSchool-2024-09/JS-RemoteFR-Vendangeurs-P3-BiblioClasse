import "../styles/Mon_livre.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddExemplaire from "../components/AddExemplaire";
// import BorrowBookModal from "../components/BorrowBookModal";
import EditBookModal from "../components/EditBookModal";
import Header from "../components/Header";

function Mon_livre() {
  const location = useLocation();
  const navigate = useNavigate();
  const { titre, auteur, livre_resume, couverture_img, ISBN } =
    location.state || {};
  const book = { titre, auteur, livre_resume, couverture_img, ISBN };
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddExemplaireModal, setShowAddExemplaireModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);
  const [exemplaires, setExemplaires] = useState<
    { id_exemplaire: number; ISBN: string; isAvailable: boolean }[]
  >([]);
  const [nbAvailableExemplaires, setNbAvailableExemplaires] = useState(0);
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  useEffect(() => {
    const fetchExemplaires = async () => {
      try {
        const response = await fetch(
          `http://localhost:3310/api/exemplaires?ISBN=${ISBN}`,
        );
        const data = await response.json();
        console.info("Exemplaires:", data);
        setExemplaires(data);
        const available = data.filter(
          (exemplaire: { isAvailable: boolean }) => exemplaire.isAvailable,
        ).length;
        setNbAvailableExemplaires(available);
      } catch (error) {
        console.error("Erreur lors de la récupération des exemplaires:", error);
      }
    };

    fetchExemplaires();
  }, [ISBN]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddBorrowClick = () => {
    setShowBorrowModal(true);
    console.info("Add book borrow");
    console.info(showBorrowModal);
  };

  // const handleBorrowModalClose = () => {
  //   setShowBorrowModal(false);
  // };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
  };

  const handleBookUpdated = (updatedBook: {
    ISBN: string;
    titre: string;
    auteur: string;
    livre_resume: string;
    couverture_img: string;
  }) => {
    // Mettre à jour l'état ou effectuer d'autres actions après la mise à jour du livre
    setCurrentBook(updatedBook);
    console.info("Book updated:", updatedBook);
  };

  const handleAddExemplaireClick = () => {
    setShowAddExemplaireModal(true);
  };

  const handleAddExemplaireModalClose = () => {
    setShowAddExemplaireModal(false);
  };

  const handleExemplaireAdded = (newExemplaire: {
    id_exemplaire: number;
    ISBN: string;
    isAvailable: boolean;
  }) => {
    console.info("Exemplaire ajouté:", newExemplaire);
    setExemplaires((prevExemplaires) => [...prevExemplaires, newExemplaire]);
    setNbAvailableExemplaires((prevAvailable) => prevAvailable + 1);
  };

  // const handleBookBorrowed = (borrowedBook: {
  //   id_exemplaire: number;
  //   id_eleve: number;
  //   date_emprunt: string;
  // }) => {
  //   console.info("Exemplaire emprunté:", borrowedBook);
  //   setExemplaires((prevExemplaires) =>
  //     prevExemplaires.map((exemplaire) =>
  //       exemplaire.id_exemplaire === borrowedBook.id_exemplaire
  //         ? { ...exemplaire, isAvailable: false }
  //         : exemplaire,
  //     ),
  //   );
  //   setNbAvailableExemplaires((prevAvailable) => prevAvailable - 1);
  // };

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
            {nbAvailableExemplaires} exemplaires disponibles sur{" "}
            {exemplaires.length}
          </p>
          <p className="titre">{currentBook.titre}</p>
          <p className="auteur">De : {currentBook.auteur}</p>
          <p className="isbn">ISBN: {currentBook.ISBN}</p>
          <p className="resume">{currentBook.livre_resume}</p>
        </div>
      </section>
      <div className="buttons">
        <button type="button" className="edit_button" onClick={handleEditClick}>
          <img src="/src/assets/images/edit-btn.png" alt="stylo" />
        </button>

        <button type="button" className="back_button" onClick={handleBackClick}>
          &#8617;
        </button>
        <button
          type="button"
          className="add_borrow_button"
          onClick={handleAddBorrowClick}
        >
          +
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
      {/* {showBorrowModal && (
        <BorrowBookModal
          showModal={showBorrowModal}
          ISBN={currentBook.ISBN}
          exemplaires={exemplaires}
          handleBookBorrowed={handleBookBorrowed}
          handleModalClose={handleBorrowModalClose}
        />
      )} */}
    </div>
  );
}

export default Mon_livre;
