import { useEffect, useState } from "react";

interface ReturnBookModalProps {
  showReturnModal: boolean;
  handleReturnModalClose: () => void;
  setShowReturnModal: (show: boolean) => void;
}
interface StudenProps {
  id_eleve: number;
  nom: string;
  prenom: string;
}
function ReturnBookModal({
  showReturnModal,
  handleReturnModalClose,
  setShowReturnModal,
}: ReturnBookModalProps) {
  if (!showReturnModal) {
    return null;
  }

  const [students, setStudents] = useState<
    { id_eleve: number; nom: string; prenom: string }[]
  >([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");

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

  const handleReturnSubmit = () => {
    console.info("Book returned");
    setShowReturnModal(false);
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
              <label htmlFor="student">Elève :</label>

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
                    className={`student-item ${studentId === Number(student.id_eleve) ? "selected" : ""}`}
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
          <button type="button">Return</button>
        </form>
      </div>
    </div>
  );
}

export default ReturnBookModal;
