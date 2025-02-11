import "../styles/AddBookManually.css";
import Cookies from "js-cookie";
import { useState } from "react";
import defaultCover from "/src/assets/images/default_book_cover.png";
import { useAuth } from "../context/AuthContext";

interface AddBookManuallyProps {
  showModalBook: boolean;
  handleModalBookClose: () => void;
  handleBookAdded: (newBook: BookProps) => void;
}
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

function AddBookManually({
  showModalBook,
  handleModalBookClose,
  handleBookAdded,
}: AddBookManuallyProps) {
  const { userId, setUserId } = useAuth();
  if (showModalBook === false) return null;

  const [ISBN, setISBN] = useState("");
  const [ISBN13, setISBN13] = useState("");
  const [ISBN10, setISBN10] = useState("");
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [livre_resume, setLivre_resume] = useState("");
  const [couverture_img, setCouverture_img] = useState("");
  const [bookInfoFetched, setBookInfoFetched] = useState(false);

  /*Permet de nettoyer automatiquemnt l'ISBN en retirant les caractères spéciaux*/
  const handleISBNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedISBN = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setISBN(cleanedISBN);
    console.info("cleanedISBN:", cleanedISBN);
  };

  /*Permet de récupérer les informations du livre via l'API Google Books puis Open Library si c'est incomplet*/
  const handleFetchBookInfo = async () => {
    try {
      console.info("ISBN:", ISBN);
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`,
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        for (const isbn of book.industryIdentifiers) {
          if (isbn.type === "ISBN_13") {
            setISBN13(isbn.identifier);
          }
          if (isbn.type === "ISBN_10") {
            setISBN10(isbn.identifier);
          }
        }
        setTitre(book.title);
        setAuteur(book.authors.join(", "));
        setLivre_resume(book.description);
        setCouverture_img(book.imageLinks?.thumbnail || defaultCover);
        setBookInfoFetched(true);
      } else {
        console.error("Aucun livre trouvé pour cet ISBN sur Google Books API");
        const openLibraryResponse = await fetch(
          `https://openlibrary.org/api/books?bibkeys=ISBN:${ISBN}&format=json&jscmd=data`,
        );
        const openLibraryData = await openLibraryResponse.json();
        const bookKey = `ISBN:${ISBN}`;
        if (openLibraryData[bookKey]) {
          const book = openLibraryData[bookKey];
          for (const isbn of book.industryIdentifiers) {
            if (isbn.type === "isbn_13") {
              setISBN13(isbn.identifier);
            }
            if (isbn.type === "isbn_10") {
              setISBN10(isbn.identifier);
            }
          }
          setTitre(book.title);
          setAuteur(
            book.authors
              .map((author: { name: string }) => author.name)
              .join(", "),
          );
          setLivre_resume(book.notes || "Pas de résumé disponible.");
          setCouverture_img(book.cover?.medium || defaultCover);
          setBookInfoFetched(true);
        } else {
          console.error(
            "Aucun livre trouvé pour cet ISBN sur Open Library API",
          );
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations du livre:",
        error,
      );
      setBookInfoFetched(false);
    }
  };

  /*Permet d'ajouter le livre*/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    const response = await fetch(`http://localhost:3310/api/${userId}/livres`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titre,
        auteur,
        livre_resume,
        couverture_img,
        ISBN10,
        ISBN13,
      }),
    });
    const responseData = await response.json();
    console.info("API response:", responseData);
    if (response.ok) {
      handleBookAdded({
        ISBN10,
        ISBN13,
        titre,
        auteur,
        livre_resume,
        couverture_img,
        nombre_exemplaires: 1,
        nombre_exemplaires_disponibles: 1,
      });
      handleModalBookClose();
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
        className="AddBookManually"
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
        <h2 className="h2modalAddBookManually">Ajouter le livre</h2>
        <form className="isbn-section">
          <label className="label-ISBN">
            <input
              className="input-ISBN"
              placeholder="ISBN"
              type="text"
              value={ISBN}
              onChange={handleISBNChange}
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
        {bookInfoFetched && (
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
            <button type="submit" className="add-book-submitbutton">
              Ajouter le livre
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddBookManually;
