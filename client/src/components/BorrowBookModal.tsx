import { useEffect, useState } from "react";
import "../styles/BorrowBookModal.css";

interface BorrowBookModalProps {
  showModal: boolean;
  availableExemplaires: {
    id_exemplaire: number;
    titre: string;
  }[];
  handleModalClose: () => void;
  handleBookBorrowed: (borrowedBook: {
    id_exemplaire: number;
    ISBN: string;
    isAvailable: boolean;
    id_eleve: number;
    date_emprunt: string;
  }) => void;
}

interface StudenProps {
  id_eleve: number;
  nom: string;
  prenom: string;
}

function BorrowBookModal({
  showModal,
  handleModalClose,
  handleBookBorrowed,
  availableExemplaires,
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
      } catch (error) {
        console.error("Erreur lors de la récupération des élèves:", error);
      }
    };

    fetchStudents();
  }, []);

  /* Fonction pour créer un emprunt */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExemplaire && studentId) {
      const response = await fetch("http://localhost:3310/api/emprunts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_exemplaire: selectedExemplaire,
          id_eleve: studentId,
          date_retour: new Date(),
        }),
      });

      if (response.ok) {
        const borrowedBook = await response.json();
        handleBookBorrowed(borrowedBook);
        handleModalClose();
      } else {
        console.error("Erreur lors de l'emprunt du livre");
      }
    }
  };

  /* Filtrage des élèves */
  const filteredStudents = students.filter((student) =>
    `${student.nom} ${student.prenom}`
      .toLowerCase()
      .includes(searchText.toLowerCase()),
  );

  if (!showModal) return null;

  return (
    <div
      className="overlay"
      onClick={handleModalClose}
      onKeyDown={handleModalClose}
    >
      <div
        className="BorrowBookModal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-button-modal"
          onClick={handleModalClose}
        >
          &times;
        </button>
        <h2 className="h2modal">Nouvel Emprunt</h2>
        <section className="modal-borrow-content">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="exemplaire">Exemplaire :</label>
              <select
                id="exemplaire"
                value={selectedExemplaire || ""}
                onChange={(e) => setSelectedExemplaire(Number(e.target.value))}
              >
                <option value="" disabled>
                  Sélectionnez un exemplaire
                </option>
                {availableExemplaires.map((exemplaire) => (
                  <option
                    key={exemplaire.id_exemplaire}
                    value={exemplaire.id_exemplaire}
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
                className="input-ISBN"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <select
                id="student"
                value={studentId || ""}
                onChange={(e) => setStudentId(Number(e.target.value))}
              >
                <option value="" disabled>
                  Sélectionnez un élève
                </option>
                {filteredStudents.map((student) => (
                  <option key={student.id_eleve} value={student.id_eleve}>
                    {student.nom} {student.prenom}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </section>
        <button type="submit" className="borrow-button">
          Emprunter
        </button>
      </div>
    </div>
  );
}

export default BorrowBookModal;
