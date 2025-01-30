import "../styles/Mon_eleve.css";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/Buttons.css";
import { useEffect, useState } from "react";
import Book from "../components/Book";
import EditStudentModal from "../components/EditStudentModal";

interface BorrowedBook {
  id_exemplaire: number;
  titre: string;
  auteur: string;
  livre_resume: string;
  couverture_img: string;
  ISBN: string;
  date_retour: string;
}

function Mon_eleve() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prenom, nom, id_eleve } = location.state;
  const student = { prenom, nom, id_eleve, nbOfBooksBorrowed: "0" };
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(student);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [nbOfBooksBorrowed, setNbOfBooksBorrowed] = useState(0);
  const [nbOfOverdueBooks, setNbOfOverdueBooks] = useState(0);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch(
          `http://localhost:3310/api/emprunts_by_student/${id_eleve}`,
        );
        const data = await response.json();
        setBorrowedBooks(data);
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

    fetchBorrowedBooks();
  }, [id_eleve]);

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

  const handleStudentUpdated = (updatedStudent: {
    prenom: string;
    nom: string;
    nbOfBooksBorrowed: string;
    id_eleve: number;
  }) => {
    // Mettre à jour l'état ou effectuer d'autres actions après la mise à jour du livre
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
            {nbOfBooksBorrowed} livres empruntés, dont {nbOfOverdueBooks} en
            retard
          </p>
        </div>
      </section>
      <section className="borrowed-books">
        <h2 className="h2-detail">Livres empruntés :</h2>
        {borrowedBooks.map((book) => (
          <div className="borrowed-book-container" key={book.id_exemplaire}>
            <Book
              titre={book.titre}
              auteur={book.auteur}
              livre_resume={book.livre_resume}
              couverture_img={book.couverture_img}
              ISBN={book.ISBN}
              date_retour={book.date_retour}
              context="mon_eleve"
            />
          </div>
        ))}
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
      <EditStudentModal
        showModal={showEditModal}
        handleModalClose={handleModalClose}
        student={currentStudent}
        onStudentUpdated={handleStudentUpdated}
      />
    </div>
  );
}

export default Mon_eleve;
