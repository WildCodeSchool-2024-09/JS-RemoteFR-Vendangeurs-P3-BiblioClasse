import { useState } from "react";
import "../styles/EditBookModal.css";

interface EditBookModalProps {
  showModal: boolean;
  handleModalClose: () => void;
  book: {
    ISBN: string;
    titre: string;
    auteur: string;
    livre_resume: string;
    couverture_img: string;
  };
  onBookUpdated: (updatedBook: {
    ISBN: string;
    titre: string;
    auteur: string;
    livre_resume: string;
    couverture_img: string;
  }) => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({
  showModal,
  handleModalClose,
  book,
  onBookUpdated,
}) => {
  const [ISBN, setISBN] = useState(book.ISBN);
  const [titre, setTitre] = useState(book.titre);
  const [auteur, setAuteur] = useState(book.auteur);
  const [livre_resume, setLivre_resume] = useState(book.livre_resume);
  const [couverture_img, setCouverture_img] = useState(book.couverture_img);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBook = { ISBN, titre, auteur, livre_resume, couverture_img };
    try {
      const response = await fetch(`http://localhost:3310/api/livres/${ISBN}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });
      if (response.ok) {
        onBookUpdated(updatedBook);
        handleModalClose();
      } else {
        console.error("Erreur lors de la mise à jour du livre");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre:", error);
    }
  };

  if (!showModal) return null;

  return (
    <div
      className="overlay"
      onClick={handleModalClose}
      onKeyDown={handleModalClose}
    >
      <div
        className="EditBookModal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-button-modal"
          onClick={handleModalClose}
        >
          &times;
        </button>
        <h2 className="h2modal">Modifier le livre</h2>
        <form onSubmit={handleSubmit} className="form-modal">
          <label className="label-bookModal">
            <p className="p-edit-book">ISBN :</p>
            <input
              className="input-bookModal"
              type="text"
              value={ISBN}
              onChange={(e) => setISBN(e.target.value)}
              required
            />
          </label>
          <label className="label-bookModal">
            <p className="p-edit-book">Titre :</p>
            <input
              className="input-bookModal"
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
            />
          </label>
          <label className="label-bookModal">
            <p className="p-edit-book">Auteur :</p>
            <input
              className="input-bookModal"
              type="text"
              value={auteur}
              onChange={(e) => setAuteur(e.target.value)}
              required
            />
          </label>
          <label className="label-bookModal">
            <p className="p-edit-book">Résumé :</p>
            <textarea
              value={livre_resume}
              onChange={(e) => setLivre_resume(e.target.value)}
              required
            />
          </label>
          <label className="label-bookModal">
            <p className="p-edit-book">Couverture :</p>
            <input
              className="input-bookModal"
              type="text"
              value={couverture_img}
              onChange={(e) => setCouverture_img(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="edit-book-button">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;
