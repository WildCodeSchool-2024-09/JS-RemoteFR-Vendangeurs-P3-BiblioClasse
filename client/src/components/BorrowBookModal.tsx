import { addDays, format } from "date-fns";
import { useEffect, useState } from "react";
import "../styles/BorrowBookModal.css";

interface BorrowBookModalProps {
  showModal: boolean;
  availableExemplaires: {
    id_exemplaire: number;
    titre: string;
    ISBN: string;
    isAvailable: boolean;
  }[];
  handleBorrowModalClose: () => void;
  handleBookBorrowed: (borrowedBook: {
    id_exemplaire: number;
    ISBN: string;
    isAvailable: boolean;
    id_eleve: number;
    date_emprunt: string;
    date_retour: string;
  }) => void;
  loanDuration: number;
}

interface StudenProps {
  id_eleve: number;
  nom: string;
  prenom: string;
}

function BorrowBookModal({
  showModal,
  handleBorrowModalClose,
  handleBookBorrowed,
  availableExemplaires,
  loanDuration,
}: BorrowBookModalProps) {
  const [selectedExemplaire, setSelectedExemplaire] = useState<number | null>(
    null,
  );
  const [studentId, setStudentId] = useState<number | null>(null);
  const [students, setStudents] = useState<StudenProps[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  /* Récupération des élèves */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:3310/api/eleves");
        const data = await response.json();
        setStudents(data);
        console.info("Eleves récupérés:", data);
      } catch (error) {
        console.error("Erreur lors de la récupération des élèves:", error);
      }
    };

    fetchStudents();
  }, []);

  /* Fonction pour créer un emprunt */
  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExemplaire && studentId) {
      try {
        const date_emprunt = new Date();
        const date_retour = addDays(date_emprunt, loanDuration);
        const formattedDateEmprunt = format(
          date_emprunt,
          "yyyy-MM-dd HH:mm:ss",
        );
        const formattedDateRetour = format(date_retour, "yyyy-MM-dd HH:mm:ss");

        const response = await fetch("http://localhost:3310/api/emprunts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_exemplaire: selectedExemplaire,
            id_eleve: studentId,
            date_emprunt: formattedDateEmprunt,
            date_retour: formattedDateRetour,
          }),
        });
        if (!response.ok) {
          throw new Error("Erreur lors de la création de l'emprunt");
        }
        const borrowedBook = await response.json();
        handleBookBorrowed(borrowedBook);
        alert("Emprunt créé avec succès");
      } catch (error) {
        console.error("Erreur lors de la création de l'emprunt:", error);
      }
    } else {
      alert("Veuillez sélectionner un élève et un exemplaire");
    }
  };

  /* Filtrage des élèves */
  const filteredStudents = students.filter((student) =>
    `${student.nom} ${student.prenom}`
      .toLowerCase()
      .includes(searchText.toLowerCase()),
  );

  /* Gestion de la sélection d'un élève */
  const handleStudentClick = (student: StudenProps) => {
    setStudentId(student.id_eleve);
    setSearchText(`${student.nom} ${student.prenom}`);
  };

  if (!showModal) return null;

  return (
    <div
      className="overlay"
      onClick={handleBorrowModalClose}
      onKeyDown={handleBorrowModalClose}
    >
      <div
        className="BorrowBookModal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-button-modal"
          onClick={handleBorrowModalClose}
        >
          &times;
        </button>
        <h2 className="h2modal">Nouvel Emprunt</h2>
        <form onSubmit={handleBorrowSubmit}>
          <section className="modal-borrow-content">
            <div>
              <label htmlFor="exemplaire">Livre :</label>
              <select
                className="option-exemplaire"
                id="exemplaire"
                value={selectedExemplaire || ""}
                onChange={(e) => setSelectedExemplaire(Number(e.target.value))}
              >
                <option value="" disabled className="option-exemplaire">
                  Sélectionnez un livre
                </option>
                {availableExemplaires.map((exemplaire) => (
                  <option
                    key={exemplaire.id_exemplaire}
                    value={exemplaire.id_exemplaire}
                    className="option-exemplaire"
                  >
                    {exemplaire.titre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="student">Élève :</label>
              <input
                type="text"
                id="student"
                placeholder="Rechercher par nom ou prénom"
                value={searchText}
                className="input-student"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="student-list-container">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id_eleve}
                    className={`student-item ${studentId === student.id_eleve ? "selected" : ""}`}
                    onClick={() => handleStudentClick(student)}
                    onKeyDown={() => handleStudentClick(student)}
                    onKeyUp={() => handleStudentClick(student)}
                  >
                    {student.nom} {student.prenom}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <button type="submit" className="borrow-button">
            Emprunter
          </button>
        </form>
      </div>
    </div>
  );
}

export default BorrowBookModal;
