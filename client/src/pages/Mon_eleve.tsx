import "../styles/Mon_eleve.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import "../styles/Buttons.css";
import Cookies from "js-cookie";
import Book from "../components/Book";
import EditStudentModal from "../components/EditStudentModal";

interface BorrowedBook {
  id_exemplaire: number;
  titre: string;
  auteur: string;
  livre_resume: string;
  couverture_img: string;
  ISBN10: string;
  ISBN13: string;
  date_retour: string;
}

function Mon_eleve() {
  const { userId, setUserId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { prenom, nom, id_eleve } = location.state;
  const student = { prenom, nom, id_eleve, nbOfBooksBorrowed: "0" };
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(student);
  const [borrowedBooksByStudentID, setBorrowedBooksByStudentID] = useState<
    BorrowedBook[]
  >([]);
  const [nbOfBooksBorrowed, setNbOfBooksBorrowed] = useState(0);
  const [nbOfOverdueBooks, setNbOfOverdueBooks] = useState(0);

  /*Récupère les livres empruntés par l'élève*/
  useEffect(() => {
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    const fetchBorrowedBooksByStudentID = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/emprunts_by_student/${id_eleve}`,
        );
        const data = await response.json();
        setBorrowedBooksByStudentID(data);
        setNbOfBooksBorrowed(data.length);
        const overdueBooks = data.filter((book: BorrowedBook) => {
          if (book.date_retour) {
            const returnDate = new Date(book.date_retour);
            return returnDate < new Date();
          }
          return false;
        }).length;
        setNbOfOverdueBooks(overdueBooks);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des livres empruntés:",
          error,
        );
      }
    };

    fetchBorrowedBooksByStudentID();
  }, [userId, id_eleve, setUserId]);

  /*Gère le retour à la page précédente*/
  const handleBackClick = () => {
    navigate(-1);
  };

  /*Gère l'ajout d'un emprunt*/
  const handleAddBorrowClick = () => {
    // logique pour ajouter un emprunt
    console.info("Add book borrow");
  };

  /*Gère l'ouverture et la fermeture de la modale d'édition de l'élève*/
  const handleEditClick = () => {
    setShowEditModal(true);
  };
  const handleModalClose = () => {
    setShowEditModal(false);
  };

  /*Gère la mise à jour de l'élève*/
  const handleStudentUpdated = (updatedStudent: {
    prenom: string;
    nom: string;
    nbOfBooksBorrowed: string;
    id_eleve: number;
  }) => {
    setCurrentStudent(updatedStudent);
  };

  return (
    <div>
      <Header />
      <section className="Mon_eleve">
        <div>
          <figure className="QRCode_container">
            <img src="/src/assets/images/QRCode.png" alt="QRCode" />
          </figure>
        </div>
        <div className="infos_eleve">
          <p className="name">{currentStudent.prenom}</p>
          <p className="name">{currentStudent.nom}</p>
          <p className="infos_livre">
            {nbOfBooksBorrowed > 1
              ? `${nbOfBooksBorrowed} livres empruntés, dont ${nbOfOverdueBooks} en
            retard`
              : `${nbOfBooksBorrowed} livre emprunté, dont ${nbOfOverdueBooks} en
            retard`}
          </p>
        </div>
      </section>
      <section className="borrowed-books">
        <h2 className="h2-detail">Livres empruntés :</h2>
        {borrowedBooksByStudentID.map((book) => (
          <div className="borrowed-book-container" key={book.id_exemplaire}>
            <Book
              titre={book.titre}
              auteur={book.auteur}
              livre_resume={book.livre_resume}
              couverture_img={book.couverture_img}
              ISBN13={book.ISBN13}
              ISBN10={book.ISBN10}
              date_retour={book.date_retour}
              context="mon_eleve"
              nombre_exemplaires={1}
              nombre_exemplaires_disponibles={1}
            />
          </div>
        ))}
      </section>
      <div className="buttons">
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
        <button type="button" className="edit_button" onClick={handleEditClick}>
          <img src="/src/assets/images/edit-btn.png" alt="stylo" />
        </button>
      </div>
      <EditStudentModal
        showModal={showEditModal}
        handleModalClose={handleModalClose}
        student={currentStudent}
        handleStudentUpdated={handleStudentUpdated}
      />
    </div>
  );
}

export default Mon_eleve;
