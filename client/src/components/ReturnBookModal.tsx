import { useEffect, useState } from "react";

interface ReturnBookModalProps {
  showReturnModal: boolean;
  handleReturnModalClose: () => void;
  setShowReturnModal: (show: boolean) => void;
  setConfirmationReturnMessage: (message: string) => void;
  setShowConfirmationReturnModal: (show: boolean) => void;
}

interface StudentProps {
  id_eleve: number;
  nom: string;
  prenom: string;
}

interface BorrowedBookProps {
  id_exemplaire: number;
  ISBN: string;
  isAvailable: boolean;
  id_eleve: number;
  date_emprunt: string;
  date_retour: string;
  titre: string;
}

function ReturnBookModal({
  showReturnModal,
  handleReturnModalClose,
  setShowReturnModal,
  setConfirmationReturnMessage,
  setShowConfirmationReturnModal,
}: ReturnBookModalProps) {
  if (!showReturnModal) {
    return null;
  }

  const [students, setStudents] = useState<StudentProps[]>([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStudentSetted, setSelectedStudentSetted] =
    useState<boolean>(false);
  const [selectedExemplaire, setSelectedExemplaire] = useState<number | null>(
    null,
  );
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBookProps[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProps | null>(
    null,
  );

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "http://localhost:3310/api/eleves_with_borrows",
        );
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des élèves:", error);
      }
    };

    const fetchBorrowedBooks = async () => {
      if (selectedStudentSetted && selectedStudent) {
        try {
          const response = await fetch(
            `http://localhost:3310/api/emprunts_by_student/${selectedStudent.id_eleve}`,
          );
          const data = await response.json();
          setBorrowedBooks(data);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des livres empruntés:",
            error,
          );
        }
      }
    };

    fetchStudents();
    fetchBorrowedBooks();
  }, [selectedStudent, selectedStudentSetted]);

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedExemplaire) {
      return;
    }

    const returnedBook = {
      id_exemplaire: selectedExemplaire,
      id_eleve: selectedStudent.id_eleve,
      date_retour_effectif: new Date().toISOString().slice(0, 10),
    };

    try {
      const response = await fetch(
        "http://localhost:3310/api/emprunts/retours",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(returnedBook),
        },
      );

      if (response.ok) {
        setConfirmationReturnMessage("Le retour a bien été enregistré");
        setShowConfirmationReturnModal(true);
        setShowReturnModal(false);
        handleReturnModalClose();
      } else {
        console.error("Erreur lors de la confirmation du retour");
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation du retour:", error);
    }
  };

  /* Filtrage des élèves */
  const filteredStudents = students.filter((student) =>
    `${student.nom} ${student.prenom}`
      .toLowerCase()
      .includes(searchText.toLowerCase()),
  );

  /* Gestion de la sélection d'un élève */
  const handleStudentClick = (student: StudentProps) => {
    setStudentId(student.id_eleve);
    setSearchText(`${student.nom} ${student.prenom}`);
    setSelectedStudentSetted(true);
    setSelectedStudent(student);
  };

  return (
    <div
      className="overlay"
      onClick={handleReturnModalClose}
      onKeyDown={handleReturnModalClose}
    >
      <div
        className="BorrowBookModal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-button-modal"
          onClick={handleReturnModalClose}
        >
          &times;
        </button>
        <h2 className="h2modal">Retourner un livre</h2>
        <form onSubmit={handleReturnSubmit}>
          <section className="modal-return-content">
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
                  >
                    {student.nom} {student.prenom}
                  </div>
                ))}
              </div>
            </div>
            {selectedStudentSetted && (
              <div>
                <label className="label-borrow-book" htmlFor="exemplaire">
                  Sélectionnez le livre à rendre :
                </label>
                <select
                  className="option-exemplaire"
                  id="exemplaire"
                  value={selectedExemplaire || ""}
                  onChange={(e) =>
                    setSelectedExemplaire(Number(e.target.value))
                  }
                >
                  <option value="" disabled>
                    Sélectionnez un livre
                  </option>
                  {borrowedBooks.map((book) => (
                    <option key={book.id_exemplaire} value={book.id_exemplaire}>
                      {book.titre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>
          <button type="submit" className="borrow-button">
            Confirmer le retour
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReturnBookModal;
