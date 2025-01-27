import { useState } from "react";

// interface BorrowBookModalProps {
//   showModal: boolean;
//   handleModalClose: () => void;
//   handleBookBorrowed: (borrowedBook: {
//     id_exemplaire: number;
//     id_eleve: number;
//     date_emprunt: string;
//   }) => void;
//   ISBN: string;
//   exemplaires: { id_exemplaire: number; ISBN: string; isAvailable: boolean }[];
//   onBookBorrowed: (borrowedExemplaire: {
//     id_exemplaire: number;
//     ISBN: string;
//     isAvailable: boolean;
//   }) => void;
// }

interface BorrowBookModalProps {
  showModal: boolean;

  ISBN: string;

  exemplaires: { id_exemplaire: number; ISBN: string; isAvailable: boolean }[];

  handleModalClose: () => void;

  handleBookBorrowed: (borrowedBook: {
    id_exemplaire: number;
    id_eleve: number;
    date_emprunt: string;
  }) => void;
}

function BorrowBookModal({
  showModal,
  handleModalClose,
  handleBookBorrowed,
  exemplaires,
}: BorrowBookModalProps) {
  const [selectedExemplaire, setSelectedExemplaire] = useState<number | null>(
    null,
  );
  const [studentId, setStudentId] = useState<number | null>(null);

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
          date_emprunt: new Date().toISOString(),
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
        <h2>Nouvel emprunt</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Exemplaire:
            <select
              value={selectedExemplaire ?? ""}
              onChange={(e) => setSelectedExemplaire(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Sélectionnez un exemplaire
              </option>
              {exemplaires.map((exemplaire) => (
                <option
                  key={exemplaire.id_exemplaire}
                  value={exemplaire.id_exemplaire}
                >
                  {exemplaire.ISBN} -{" "}
                  {exemplaire.isAvailable ? "Disponible" : "Indisponible"}
                </option>
              ))}
            </select>
          </label>
          <label>
            ID de l'élève:
            <input
              type="number"
              value={studentId ?? ""}
              onChange={(e) => setStudentId(Number(e.target.value))}
              required
            />
          </label>
          <button type="submit">Emprunter</button>
        </form>
      </div>
    </div>
  );
}

export default BorrowBookModal;
