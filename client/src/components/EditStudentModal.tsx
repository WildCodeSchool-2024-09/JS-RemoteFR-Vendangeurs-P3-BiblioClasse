import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/EditStudentModal.css";
import Cookies from "js-cookie";

interface EditStudentModalProps {
  showModal: boolean;
  handleModalClose: () => void;
  student: {
    prenom: string;
    nom: string;
    id_eleve: number;
    nbOfBooksBorrowed: string;
  };
  handleStudentUpdated: (updatedStudent: {
    prenom: string;
    nom: string;
    id_eleve: number;
    nbOfBooksBorrowed: string;
  }) => void;
}

function EditStudentModal({
  showModal,
  handleModalClose,
  student,
  handleStudentUpdated,
}: EditStudentModalProps) {
  const { userId, setUserId } = useAuth();
  const [prenom, setPrenom] = useState(student.prenom);
  const [nom, setNom] = useState(student.nom);

  /*Gère la modification de l'élève*/
  const handleSubmit = async (e: React.FormEvent) => {
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    e.preventDefault();
    const updatedStudent = {
      prenom,
      nom,
      id_eleve: student.id_eleve,
      nbOfBooksBorrowed: student.nbOfBooksBorrowed,
    };
    try {
      const response = await fetch(
        `http://localhost:3310/api/${userId}/eleves/${student.id_eleve}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedStudent),
        },
      );
      if (response.ok) {
        handleStudentUpdated(updatedStudent);
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
        className="EditStudentModal"
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
        <h2 className="h2modal">Modifier les informations de l'élève</h2>
        <form onSubmit={handleSubmit} className="form-modal">
          <label className="label-studentModal">
            <p className="etiquette-student">Prénom :</p>
            <input
              className="input-studentModal"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </label>
          <label className="label-studentModal">
            <p className="etiquette-student">Nom :</p>
            <input
              className="input-studentModal"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="edit-student-button">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditStudentModal;
