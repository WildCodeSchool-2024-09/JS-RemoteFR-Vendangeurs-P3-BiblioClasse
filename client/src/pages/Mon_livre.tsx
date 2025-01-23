import "../styles/Mon_livre.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditBookModal from "../components/EditBookModal";
import Header from "../components/Header";

function Mon_livre() {
  const location = useLocation();
  const navigate = useNavigate();
  const { titre, auteur, livre_resume, couverture_img, ISBN } = location.state;
  const book = { titre, auteur, livre_resume, couverture_img, ISBN };
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);

  console.info(titre, auteur, livre_resume, couverture_img, ISBN);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddBorrowClick = () => {
    // logique pour ajouter un emprunt
    console.info("Add book borrow");
  };

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
          </figure>
        </div>
        <div className="infos_livre">
          <p className="exemplaire">2 exemplaires disponibles sur 3</p>
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
    </div>
  );
}

export default Mon_livre;
