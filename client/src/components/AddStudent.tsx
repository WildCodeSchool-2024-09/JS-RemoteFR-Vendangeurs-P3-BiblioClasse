import "../styles/AddStudent.css";
import Cookies from "js-cookie";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { StudentProps } from "../pages/Ma_classe";

interface AddStudentProps {
  showModal: boolean;
  handleModalClose: () => void;
  handleStudentAdded: (newStudent: StudentProps) => void;
}

function AddStudent({
  showModal,
  handleModalClose,
  handleStudentAdded,
}: AddStudentProps) {
  const { userId, setUserId } = useAuth();
  if (showModal === false) return null;

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    const response = await fetch(`http://localhost:3310/api/${userId}/eleves`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nom, prenom }),
    });
    if (response.ok) {
      const newStudent: StudentProps = {
        nom,
        prenom,
        id_eleve: 0, // or any default value
        date_retour: "", // or any default value
        nbOfBooksBorrowed: 0, // or any default value
      };
      handleStudentAdded(newStudent);
      setNom("");
      setPrenom("");
    } else {
      console.error("Erreur lors de l'ajout de l'élève");
    }
    handleModalClose();
  };

  return (
    <div
      className="overlay"
      onClick={handleModalClose}
      onKeyDown={handleModalClose}
    >
      <div
        className="AddStudent"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-button-modal"
          onClick={handleModalClose}
        >
          x
        </button>
        <h2 className="h2modal">Ajouter un élève</h2>
        {/*formulaire d'ajout d'un élève*/}
        <form onSubmit={handleSubmit} className="form-modal">
          <label>
            Prénom :
            <input
              type="text"
              name="firstName"
              placeholder="Prénom..."
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </label>
          <label>
            Nom :
            <input
              type="text"
              name="lastName"
              placeholder="Nom..."
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="button-modal-all">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
