import "../styles/AddBookManually.css";
import { useState } from "react";

interface AddBookManuallyProps {
  showModalBook: boolean;
  handleModalBookClose: () => void;
  onBookAdded: (newBook: BookProps) => void;
}
interface BookProps {
  titre: string;
  auteur: string;
  livre_resume: string;
  couverture_img: string;
  ISBN: string;
}

function AddBookManually({
  showModalBook,
  handleModalBookClose,
  onBookAdded,
}: AddBookManuallyProps) {
  if (showModalBook === false) return null;

  const [ISBN, setISBN] = useState("");
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [livre_resume, setLivre_resume] = useState("");
  const [couverture_img, setCouverture_img] = useState("");

  const handleFetchBookInfo = async () => {
    try {
      console.info(`Fetching book info for ISBN: ${ISBN}`);
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`,
      );
      const data = await response.json();
      console.info("Google Books API response:", data);
      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        setTitre(book.title);
        setAuteur(book.authors.join(", "));
        setLivre_resume(book.description);
        setCouverture_img(book.imageLinks?.thumbnail || "default_cover_url");
        console.info("Book info set:", {
          ISBN: ISBN,
          titre: book.title,
          auteur: book.authors.join(", "),
          livre_resume: book.description,
          couverture_img: book.imageLinks?.thumbnail || "default_cover_url",
        });
      } else {
        console.error("Aucun livre trouvé pour cet ISBN");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations du livre:",
        error,
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.info("Submitting book:", {
      ISBN,
      titre,
      auteur,
      livre_resume,
      couverture_img,
    });
    // Envoyer les données du livre au serveur pour les ajouter à la base de données
    const response = await fetch("http://localhost:3310/api/livres", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ISBN,
        titre,
        auteur,
        livre_resume,
        couverture_img,
      }),
    });
    const responseData = await response.json();
    console.info("API response:", responseData);
    if (response.ok) {
      console.info("Livre ajouté avec succès");
      onBookAdded({
        ISBN,
        titre,
        auteur,
        livre_resume,
        couverture_img,
      });
      handleModalBookClose(); // Fermer la modale après une soumission réussie
    } else {
      console.error("Erreur lors de l'ajout du livre");
    }
  };

  return (
    <div
      className="overlay"
      onClick={handleModalBookClose}
      onKeyDown={handleModalBookClose}
    >
      <div
        className="AddbookManually"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-button-modal"
          onClick={handleModalBookClose}
        >
          &times;
        </button>
        <h2 className="h2modal">Ajouter le livre</h2>
        <form className="isbn-section">
          <label className="label-ISBN">
            <input
              className="input-ISBN"
              placeholder="ISBN"
              type="text"
              value={ISBN}
              onChange={(e) => setISBN(e.target.value)}
              required
            />
          </label>
          <button
            type="button"
            onClick={handleFetchBookInfo}
            className="button"
          >
            Rechercher
          </button>
        </form>
        <form onSubmit={handleSubmit} className="form-modal-ISBN">
          <label className="label-ISBN">
            <input
              className="input-ISBN"
              type="text"
              placeholder="Titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
            />
          </label>
          <label className="label-ISBN">
            <input
              className="input-ISBN"
              placeholder="Auteur"
              type="text"
              value={auteur}
              onChange={(e) => setAuteur(e.target.value)}
              required
            />
          </label>
          <label className="label-ISBN">
            <textarea
              className="input-ISBN"
              placeholder="Résumé"
              value={livre_resume}
              onChange={(e) => setLivre_resume(e.target.value)}
              required
            />
          </label>
          <label className="label-ISBN">
            <input
              className="input-ISBN"
              placeholder="URL de la couverture"
              type="text"
              value={couverture_img}
              onChange={(e) => setCouverture_img(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="button">
            Ajouter le livre
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBookManually;
