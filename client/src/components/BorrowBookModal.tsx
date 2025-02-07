import { addDays, format } from "date-fns";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/BorrowBookModal.css";
import Cookies from "js-cookie";

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
  setAvailableExemplaires: (
    exemplaires:
      | {
          id_exemplaire: number;
          titre: string;
          ISBN: string;
          isAvailable: boolean;
        }[]
      | ((
          prevExemplaires: {
            id_exemplaire: number;
            titre: string;
            ISBN: string;
            isAvailable: boolean;
          }[],
        ) => {
          id_exemplaire: number;
          titre: string;
          ISBN: string;
          isAvailable: boolean;
        }[]),
  ) => void;
  setErrorLoanMessage: (message: string) => void;
  errorLoanMessage: string;
  setConfirmationStudent: (message: string) => void;
  setConfirmationBook: (message: string) => void;
  setConfirmationDateRetour: (message: string) => void;
  borrowLimit: number;
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
  setAvailableExemplaires,
  loanDuration,
  setErrorLoanMessage,
  errorLoanMessage,
  setConfirmationStudent,
  setConfirmationBook,
  setConfirmationDateRetour,
  borrowLimit,
}: BorrowBookModalProps) {
  const { userId, setUserId } = useAuth();
  if (!showModal) return null;

  const [selectedExemplaire, setSelectedExemplaire] = useState<number | null>(
    null,
  );
  const [studentId, setStudentId] = useState<number | null>(null);
  const [students, setStudents] = useState<StudenProps[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStudentSetted, setSelectedStudentSetted] =
    useState<boolean>(false);
  const [dateRetour, setDateRetour] = useState<string>("");
  const [dateEmprunt, setDateEmprunt] = useState<string>();
  const [showAllForm, setShowAllForm] = useState<boolean>(true);
  const [errorBorrowLimitMessage, setErrorBorrowLimitMessage] = useState("");

  /* Calcul de la date de retour */
  useEffect(() => {
    if (selectedStudentSetted && selectedExemplaire) {
      const date_emprunt = new Date();
      const date_retour = addDays(date_emprunt, loanDuration);
      const formattedDateEmprunt = format(date_emprunt, "yyyy-MM-dd");
      const formattedDateRetour = format(date_retour, "yyyy-MM-dd");
      setDateEmprunt(formattedDateEmprunt);
      setDateRetour(formattedDateRetour);
    }
  }, [loanDuration, selectedStudentSetted, selectedExemplaire]);

  /* Récupération des élèves */
  useEffect(() => {
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `http://localhost:3310/api/${userId}/eleves`,
        );
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des élèves:", error);
      }
    };

    fetchStudents();
  }, [userId, setUserId]);

  /* Récupération du nb de livres empruntés par l'élève */
  const countBorrowedBooksByStudent = async (id_eleve: number) => {
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    const response = await fetch(
      `http://localhost:3310/api/${userId}/emprunts_by_student/${id_eleve}`,
    );
    const borrowedBooksbySudent = await response.json();
    return borrowedBooksbySudent.length;
  };

  /* Fonction pour créer un emprunt */
  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !selectedExemplaire) {
      setErrorLoanMessage("Veuillez sélectionner un élève et un exemplaire.");
      return;
    }

    const selectedStudent = students.find(
      (student) => student.id_eleve === studentId,
    );
    const book = availableExemplaires.find(
      (exemplaire) => exemplaire.id_exemplaire === selectedExemplaire,
    );

    if (!selectedStudent || !book) {
      setErrorLoanMessage(
        "Erreur lors de la sélection de l'élève ou du livre.",
      );
      return;
    }

    const borrowedBooksCount = await countBorrowedBooksByStudent(studentId);
    if (borrowedBooksCount >= borrowLimit) {
      setShowAllForm(false);
      setErrorBorrowLimitMessage(
        "Limite de livres empruntés atteinte, veuillez rendre un livre avant d'en emprunter un nouveau. Pour modifier la limite par défaut : Menu Accueil > Paramètres",
      );
      return;
    }

    const borrowedBook = {
      id_exemplaire: selectedExemplaire,
      ISBN: book.ISBN,
      isAvailable: false,
      id_eleve: studentId,
      date_emprunt: dateEmprunt,
      date_retour: dateRetour,
    };

    try {
      const response = await fetch(
        `http://localhost:3310/api/${userId}/emprunts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(borrowedBook),
        },
      );

      if (response.ok) {
        const result = await response.json();
        handleBookBorrowed(result);
        setAvailableExemplaires(
          (
            prevExemplaires: {
              id_exemplaire: number;
              titre: string;
              ISBN: string;
              isAvailable: boolean;
            }[],
          ) =>
            prevExemplaires.map((exemplaire) =>
              exemplaire.id_exemplaire === selectedExemplaire
                ? { ...exemplaire, isAvailable: false } // Marquer comme non disponible
                : exemplaire,
            ),
        );
        setErrorLoanMessage("");
        setErrorBorrowLimitMessage("");
        setConfirmationStudent(
          `${selectedStudent.nom} ${selectedStudent.prenom}`,
        );
        setConfirmationBook(book.titre);
        setConfirmationDateRetour(dateRetour);
      } else {
        const errorData = await response.json();
        setErrorLoanMessage(
          errorData.error || "Erreur lors de la création de l'emprunt",
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'emprunt:", error);
      setErrorLoanMessage("Erreur lors de la création de l'emprunt");
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
    setSelectedStudentSetted(true);
  };

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

        {showAllForm && (
          <form onSubmit={handleBorrowSubmit}>
            <section className="modal-borrow-content">
              <div>
                <label className="label-borrow-book" htmlFor="student">
                  Sélectionnez l'élève :
                </label>
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
                      className={`student-item ${
                        studentId === student.id_eleve ? "selected" : ""
                      }`}
                      onClick={() => handleStudentClick(student)}
                      onKeyDown={() => handleStudentClick(student)}
                      onKeyUp={() => handleStudentClick(student)}
                    >
                      {student.nom} {student.prenom}
                    </div>
                  ))}
                </div>
              </div>

              {selectedStudentSetted && (
                <div>
                  <label className="label-borrow-book" htmlFor="exemplaire">
                    Choisissez le livre :
                  </label>
                  <select
                    className="option-exemplaire"
                    id="exemplaire"
                    value={selectedExemplaire || ""}
                    onChange={(e) =>
                      setSelectedExemplaire(Number(e.target.value))
                    }
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
              )}

              {selectedStudentSetted && selectedExemplaire && (
                <div className="field">
                  <label className="label-borrow-book" htmlFor="date_retour">
                    Date de retour* :
                  </label>
                  <div className="control">
                    <input
                      type="date"
                      className="input-date-retour"
                      value={dateRetour}
                      onChange={(e) => setDateRetour(e.target.value)}
                    />
                  </div>
                  <p className="p-loan-duration">
                    * Pour modifier la durée d'emprunt par défaut : Menu Accueil
                    &gt; Paramètres
                  </p>
                </div>
              )}
            </section>

            {errorLoanMessage && (
              <div className="error-loan-message">{errorLoanMessage}</div>
            )}

            <button type="submit" className="borrow-button">
              Emprunter
            </button>
          </form>
        )}
        {errorBorrowLimitMessage && (
          <div className="error-loan-message">{errorBorrowLimitMessage}</div>
        )}
      </div>
    </div>
  );
}

export default BorrowBookModal;
