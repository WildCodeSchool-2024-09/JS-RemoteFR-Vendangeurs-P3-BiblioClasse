import "../styles/AddBookScan.css";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import defaultCover from "/src/assets/images/default_book_cover.png";
import { useAuth } from "../context/AuthContext";

interface AddBookScanProps {
  showModalScan: boolean;
  handleModalScanClose: () => void;
  handleBookAdded: (book: BookProps) => void;
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

function AddBookScan({
  showModalScan,
  handleModalScanClose,
  handleBookAdded,
}: AddBookScanProps) {
  const { userId, setUserId } = useAuth();
  if (!showModalScan) return null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [ISBN, setISBN] = useState<string>("");
  const [ISBN13, setISBN13] = useState("");
  const [ISBN10, setISBN10] = useState("");
  const [bookInfo, setBookInfo] = useState<BookProps | null>(null);
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [livre_resume, setLivre_resume] = useState("");
  const [couverture_img, setCouverture_img] = useState(defaultCover);

  /* Gère le scan et récupère l'ISBN du livre scanné */
  useEffect(() => {
    /* Lance la caméra*/
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("getUserMedia non supporté par ce navigateur");
        }
        // vérifie l'accès à la caméra
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        /* vérifie si la caméra est déjà utilisée */
        if (videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Erreur accès caméra:", error);
      }
    };
    /* Arrête la caméra*/
    const stopCamera = () => {
      console.info("coucou StopCaméra");
      console.info("Arrêt et nettoyage de la caméra...");
      codeReader.reset();
      if (
        videoRef.current &&
        videoRef.current.srcObject instanceof MediaStream
      ) {
        const stream = videoRef.current.srcObject as MediaStream;
        for (const track of stream.getTracks()) {
          track.stop(); // Coupe la caméra proprement
        }
        videoRef.current.srcObject = null;
      }
    };

    startCamera();

    /* Initialisation du scanner */
    const codeReader = new BrowserMultiFormatReader();
    codeReader.reset();

    if (videoRef.current) {
      // Initialiser le scanner, mais ne pas commencer immédiatement à scanner
      codeReader.decodeFromVideoDevice(
        null,
        videoRef.current,
        async (result, err) => {
          if (result) {
            const cleanedISBN = result.getText().replace(/[^0-9Xx-]/g, "");
            console.info("ISBN scanné:", cleanedISBN);
            setISBN(cleanedISBN);

            // Appel API pour récupérer les infos du livre
            const book = await fetchBookInfo(cleanedISBN);
            if (book) {
              setBookInfo(book);
              setTitre(book.titre);
              setAuteur(book.auteur);
              setLivre_resume(book.livre_resume);
              setCouverture_img(book.couverture_img);
              setISBN10(book.ISBN10);
              setISBN13(book.ISBN13);

              stopCamera();
            }
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error("Erreur de scan :", err);
          }
        },
      );
    }
    stopCamera();
  }, []);

  /* Fonction pour récupérer les infos du livre */
  const fetchBookInfo = async (ISBN: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`,
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        return {
          titre: book.title || "Titre inconnu",
          auteur: book.authors ? book.authors.join(", ") : "Auteur inconnu",
          livre_resume: book.description || "Résumé non disponible",
          couverture_img: book.imageLinks?.thumbnail || defaultCover,
          ISBN10:
            book.industryIdentifiers?.find(
              (id: { type: string }) => id.type === "ISBN_10",
            )?.identifier || "",
          ISBN13:
            book.industryIdentifiers?.find(
              (id: { type: string }) => id.type === "ISBN_13",
            )?.identifier || "",
          nombre_exemplaires: 1,
          nombre_exemplaires_disponibles: 1,
        };
      }

      console.warn(
        "Livre non trouvé sur Google Books API, tentative Open Library...",
      );

      // Tentative avec Open Library
      const openLibraryResponse = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${ISBN13}&format=json&jscmd=data`,
      );
      const openLibraryData = await openLibraryResponse.json();
      const bookKey = `ISBN:${ISBN13}`;

      if (openLibraryData[bookKey]) {
        const book = openLibraryData[bookKey];
        return {
          titre: book.title || "Titre inconnu",
          auteur: book.authors
            ? book.authors
                .map((author: { name: string }) => author.name)
                .join(", ")
            : "Auteur inconnu",
          livre_resume: book.notes || "Résumé non disponible",
          couverture_img: book.cover?.medium || defaultCover,
          ISBN10:
            book.industryIdentifiers?.find(
              (id: { type: string }) => id.type === "isbn_10",
            )?.identifier || "",
          ISBN13:
            book.industryIdentifiers?.find(
              (id: { type: string }) => id.type === "isbn_13",
            )?.identifier || "",
          nombre_exemplaires: 1,
          nombre_exemplaires_disponibles: 1,
        };
      }

      console.error("Livre introuvable sur Open Library API");
      return null;
    } catch (error) {
      console.error("Erreur API :", error);
      return null;
    }
  };

  /* Ajoute le livre */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }

    const newBook = {
      titre,
      auteur,
      livre_resume,
      couverture_img,
      ISBN10,
      ISBN13,
      nombre_exemplaires: 1,
      nombre_exemplaires_disponibles: 1,
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/${userId}/livres`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      },
    );

    const responseData = await response.json();
    console.info("Réponse serveur:", responseData);
    if (response.ok) {
      handleBookAdded(newBook);
      handleModalScanClose();
    } else {
      console.error("Erreur lors de l'ajout du livre");
    }
  };

  return (
    <div
      className="overlay"
      onClick={handleModalScanClose}
      onKeyDown={handleModalScanClose}
    >
      <div
        className="AddBookScan"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-button-modal"
          onClick={handleModalScanClose}
          onKeyDown={handleModalScanClose}
        >
          &times;
        </button>
        <h2 className="h2modalAddBookScan">Ajouter le livre</h2>
        {!bookInfo && (
          <>
            <h3 className="isbn-section">Scanner le code barre du livre</h3>
            <video className="video" ref={videoRef}>
              <track kind="captions" />
            </video>
          </>
        )}

        {bookInfo && (
          <form onSubmit={handleSubmit} className="form-modal-ISBN">
            <label className="label-ISBN">
              <input
                type="text"
                className="input-ISBN"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
                placeholder="Titre"
              />
            </label>
            <label className="label-ISBN">
              <input
                type="text"
                className="input-ISBN"
                value={auteur}
                onChange={(e) => setAuteur(e.target.value)}
                required
                placeholder="Auteur"
              />
            </label>
            <label className="label-ISBN">
              <input
                type="text"
                className="input-ISBN"
                value={ISBN}
                onChange={(e) => setISBN(e.target.value)}
                required
                placeholder="Auteur"
              />
            </label>
            <label className="label-ISBN">
              <textarea
                value={livre_resume}
                onChange={(e) => setLivre_resume(e.target.value)}
                required
                placeholder="Résumé"
                className="input-ISBN"
              />
            </label>
            <label className="label-ISBN">
              <input
                className="input-ISBN"
                type="text"
                value={couverture_img}
                onChange={(e) => setCouverture_img(e.target.value)}
                required
                placeholder="URL de la couverture"
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

export default AddBookScan;
