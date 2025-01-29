import "../styles/Mon_eleve.css";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/Buttons.css";
import { useState } from "react";
import EditStudentModal from "../components/EditStudentModal";

function Mon_eleve() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prenom, nom, nbOfBooksBorrowed, id_eleve } = location.state;
  const student = { prenom, nom, nbOfBooksBorrowed, id_eleve };
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(student);

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
            {nbOfBooksBorrowed} livres empruntés, dont 1 en retard
          </p>
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
