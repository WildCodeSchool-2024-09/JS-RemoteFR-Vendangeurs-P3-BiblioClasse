import { useState } from "react";
import "../styles/EditBookModal.css";

interface EditStudentModalProps {
  showModal: boolean;
  handleModalClose: () => void;
  student: {
    prenom: string;
    nom: string;
    id_eleve: number;
    nbOfBooksBorrowed: string;
  };
  onStudentUpdated: (updatedStudent: {
    prenom: string;
    nom: string;
    id_eleve: number;
    nbOfBooksBorrowed: string;
  }) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  showModal,
  handleModalClose,
  student,
  onStudentUpdated,
}) => {
  const [prenom, setPrenom] = useState(student.prenom);
  const [nom, setNom] = useState(student.nom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStudent = {
      prenom,
      nom,
      id_eleve: student.id_eleve,
      nbOfBooksBorrowed: student.nbOfBooksBorrowed,
    };
    try {
      const response = await fetch(
        `http://localhost:3310/api/eleves/${student.id_eleve}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedStudent),
        },
      );
      if (response.ok) {
        onStudentUpdated(updatedStudent);
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
            Prénom :
            <input
              className="input-bookModal"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </label>
          <label className="label-bookModal">
            Nom :
            <input
              className="input-bookModal"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="button">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
