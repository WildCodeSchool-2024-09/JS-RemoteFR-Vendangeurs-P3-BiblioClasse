import Header from "../components/Header";
import "../styles/BiblioClasse.css";
import { useEffect, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/BurgerMenu.css";
import Cookies from "js-cookie";
import AddBookManually from "../components/AddBookManually";
import AddStudent from "../components/AddStudent";
import BorrowBookModal from "../components/BorrowBookModal";
import ConfirmationLoanModale from "../components/ConfirmationLoanModale";
import ConfirmationReturnModale from "../components/ConfirmationReturnModale";
import EmptyApp from "../components/EmptyApp";
import ParametresModal from "../components/ParametresModal";
import ReturnBookModal from "../components/ReturnBookModal";

interface BorrowedBook {
  id_exemplaire: number;
  ISBN13: string;
  isAvailable: boolean;
  id_eleve: number;
  date_emprunt: string;
}

interface Exemplaire {
  titre: string;
  id_exemplaire: number;
  isAvailable: boolean;
  ISBN13: string;
}

interface TopBooks {
  ISBN13: string;
  couverture_img: string;
  titre: string;
  nb_emprunts: number;
  auteur: string;
}

function BiblioClasse() {
  const { userId, setUserId } = useAuth();

  interface StudentProps {
    id_eleve: number;
    nom: string;
    prenom: string;
  }

  const [students, setStudents] = useState<StudentProps[]>([]);
  const [nbOfStudents, setNbOfStudents] = useState<number>(0);
  const [books, setBooks] = useState<number>(0);
  const [exemplaires, setExemplaires] = useState<Exemplaire[]>([]);
  const [availableExemplaires, setAvailableExemplaires] = useState<
    Exemplaire[]
  >([]);
  const [loansInProgress, setLoansInProgress] = useState<BorrowedBook[]>([]);
  const [studentsWithLoansInProgress, setStudentsWithLoansInProgress] =
    useState<number>(0);
  const [studentsWithLoansDueIn7Days, setStudentsWithLoansDueIn7Days] =
    useState<number>(0);
  const [studentsWithOverdueLoans, setStudentsWithOverdueLoans] =
    useState<number>(0);
  const [loanDuration, setLoanDuration] = useState<number>(7);
  const [topBooks, setTopBooks] = useState<TopBooks[]>([]);
  const [showEmptyApp, setShowEmptyApp] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showAddBookModal, setShowAddBookModal] = useState<boolean>(false);
  const [showAddStudentModal, setShowAddStudentModal] =
    useState<boolean>(false);
  const [showBorrowModal, setShowBorrowModal] = useState<boolean>(false);
  const [showParametresModal, setShowParametresModal] =
    useState<boolean>(false);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [errorLoanMessage, setErrorLoanMessage] = useState<string>("");
  useState<string>("");
  const [showConfirmationLoanModal, setShowConfirmationLoanModal] =
    useState<boolean>(false);
  const [confirmationStudent, setConfirmationStudent] = useState<string>("");
  const [confirmationBook, setConfirmationBook] = useState<string>("");
  const [confirmationDateRetour, setConfirmationDateRetour] =
    useState<string>("");
  const [showConfirmationReturnModal, setShowConfirmationReturnModal] =
    useState<boolean>(false);
  const [confirmationReturnMessage, setConfirmationReturnMessage] =
    useState<string>("");
  const [borrowLimit, setBorrowLimit] = useState<number>(5);

  ////////////////*FETCH DATA*////////////////////
  useEffect(() => {
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/eleves`,
        );
        const data = await response.json();
        setStudents(data);
        setNbOfStudents(data ? data.length : 0);
      } catch (error) {
        console.error("Erreur lors de la récupération des élèves:", error);
      }
    };

    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/livres`,
        );
        const data = await response.json();
        setBooks(data ? data.length : 0);
      } catch (error) {
        console.error("Erreur lors de la récupération des livres:", error);
      }
    };

    const fetchExemplaires = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/exemplaires`,
        );
        const data = await response.json();
        setExemplaires(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des exemplaires:", error);
      }
    };

    const fetchAvailableExemplaires = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/exemplaires_available`,
        );
        const data = await response.json();
        setAvailableExemplaires(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des exemplaires:", error);
      }
    };

    const fetchStudentsWithLoansInProgress = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/students-with-loans-in-progress`,
        );
        const data = await response.json();
        setStudentsWithLoansInProgress(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des emprunts en cours:",
          error,
        );
      }
    };

    const fetchStudentsWithLoansDueIn7Days = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/students-with-loans-due-in-7-days`,
        );
        const data = await response.json();
        setStudentsWithLoansDueIn7Days(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des emprunts à rednre bientôt:",
          error,
        );
      }
    };

    const fetchStudentsWithOverdueLoans = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/students-with-overdue-loans`,
        );
        const data = await response.json();
        setStudentsWithOverdueLoans(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des emprunts en retard:",
          error,
        );
      }
    };

    const fetchLoansInProgress = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/emprunts_in-progress`,
        );
        const data = await response.json();
        setLoansInProgress(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des emprunts en cours:",
          error,
        );
      }
    };

    const fetchTopBooks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/top_books`,
        );
        const data = await response.json();
        setTopBooks(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des topBooks:", error);
      }
    };

    fetchStudents();
    fetchBooks();
    fetchExemplaires();
    fetchAvailableExemplaires();
    fetchStudentsWithLoansInProgress();
    fetchStudentsWithLoansDueIn7Days();
    fetchStudentsWithOverdueLoans();
    fetchLoansInProgress();
    fetchTopBooks();
  }, [userId, setUserId]);

  ////////////////*MODALE VIDE*////////////////////
  /* Assure l'ouverture de la modale si books et students sont à 0 */
  useEffect(() => {
    if (books === 0 && nbOfStudents === 0) {
      setShowEmptyApp(true);
    } else {
      setShowEmptyApp(false);
    }
  }, [books, nbOfStudents]);

  ////////////////*NAVIGATION*////////////////////
  /*Assure la navigation*/
  const navigate = useNavigate();
  const handleBibliothequeClick = () => {
    navigate("/bibliotheque");
  };
  const handleClasseClick = () => {
    navigate("/classe");
  };
  const handleClick = (
    ISBN13: string,
    titre: string,
    couverture_img: string,
    auteur: string,
  ) => {
    navigate(`/livre/${ISBN13}`, {
      state: { titre, couverture_img, ISBN13, auteur },
    });
  };

  ////////////////*MENU TIROIR*////////////////////
  /*Assure l'ouverture du menu tiroir*/
  const handleMenuStateChange = (state: { isOpen: boolean }) => {
    setMenuOpen(state.isOpen);
  };

  ////////////////*AJOUT DE LIVRES*////////////////////
  /*Assure l'ouverture de la modale d'ajout de livre*/
  const handleAddBookClick = () => {
    setShowAddBookModal(true);
  };
  /*Assure la fermeture de la modale d'ajout de livre*/
  const handleModalClose = () => {
    setShowAddBookModal(false);
  };
  /*Assure l'incrément du nombre de livres*/
  const handleBookAdded = () => {
    setBooks((prevBooks) => prevBooks + 1);
    setShowAddBookModal(false);
    if (books > 0) setShowEmptyApp(false);
  };

  ////////////////*AJOUT D'ELEVES*////////////////
  /*Assure l'ouverture de la modale d'ajout d'élève*/
  const handleAddStudentClick = () => {
    setShowAddStudentModal(true);
  };
  /*Assure la fermeture de la modale d'ajout d'élève*/
  const handleAddStudentModalClose = () => {
    setShowAddStudentModal(false);
  };
  /*Assure l'incrément du nombre d'élèves*/
  const handleStudentAdded = () => {
    setNbOfStudents((prevNbOfStudents) => prevNbOfStudents + 1);
    setShowAddStudentModal(false);
    if (nbOfStudents > 0) setShowEmptyApp(false);
  };

  ////////////////*GESTION DES RETOURS*////////////////
  const handleAddReturnClick = () => {
    setShowReturnModal(true);
  };
  const handleReturnModalClose = () => {
    setShowReturnModal(false);
    setTimeout(() => {
      setShowConfirmationReturnModal(false);
    }, 2000);
  };

  ////////////////*AJOUT D'EMPRUNT*////////////////
  /*Assure l'ouverture de la modale d'ajout d'emprunt*/
  const handleAddBorrowClick = () => {
    setShowBorrowModal(true);
  };
  /*Assure la fermeture de la modale d'ajout d'emprunt*/
  const handleBorrowModalClose = () => {
    setShowBorrowModal(false);
    setErrorLoanMessage("");
  };
  /*Met à jour la disponibilité de l'exemplaire emprunté*/
  const handleBookBorrowed = (borrowedBook: BorrowedBook): void => {
    setExemplaires((prevExemplaires) =>
      prevExemplaires.map((exemplaire) =>
        exemplaire.id_exemplaire === borrowedBook.id_exemplaire
          ? { ...exemplaire, isAvailable: false }
          : exemplaire,
      ),
    );
    setLoansInProgress((prevLoansInProgress) => [
      ...prevLoansInProgress,
      borrowedBook,
    ]);
    setShowBorrowModal(false);
    setShowConfirmationLoanModal(true);
    setTimeout(() => {
      setShowConfirmationLoanModal(false);
    }, 5000);
  };

  const updateLoanStats = async () => {
    try {
      // Récupérer toutes les statistiques nécessaires
      const [
        studentsInProgressResponse,
        studentsDueIn7DaysResponse,
        overdueLoansResponse,
        loansInProgressResponse,
        availableExemplairesResponse,
      ] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/students-with-loans-in-progress`,
        ),
        fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/students-with-loans-due-in-7-days`,
        ),
        fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/students-with-overdue-loans`,
        ),
        fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/emprunts_in-progress`,
        ),
        fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/exemplaires_available`,
        ),
      ]);

      // Attendre les réponses
      const studentsInProgress = await studentsInProgressResponse.json();
      const studentsDueIn7Days = await studentsDueIn7DaysResponse.json();
      const overdueLoans = await overdueLoansResponse.json();
      const loansInProgress = await loansInProgressResponse.json();
      const availableExemplaires = await availableExemplairesResponse.json();

      // Mettre à jour les états avec les données récupérées
      setStudentsWithLoansInProgress(studentsInProgress);
      setStudentsWithLoansDueIn7Days(studentsDueIn7Days);
      setStudentsWithOverdueLoans(overdueLoans);
      setLoansInProgress(loansInProgress);
      setAvailableExemplaires(availableExemplaires);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des statistiques:", error);
    }
  };

  ////////////////*PARAMETRES*////////////////
  /*Assure l'ouverture de la modale et la fermeture du menu tiroir*/
  const handleOpenParametresModal = () => {
    setShowParametresModal(true);
    setMenuOpen(false);
  };

  ////////////////*DECONNEXION*////////////////
  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/");
  };

  if (showEmptyApp) {
    return (
      <div>
        <Header />
        <Menu right isOpen={menuOpen} onStateChange={handleMenuStateChange}>
          <div className="menu-item">
            <strong>Se déconnecter</strong>
          </div>
        </Menu>
        <EmptyApp
          onAddBookClick={handleAddBookClick}
          onAddStudentClick={handleAddStudentClick}
          onClose={() => setShowEmptyApp(false)}
        />
        {showAddBookModal && (
          <AddBookManually
            showModalBook={showAddBookModal}
            handleModalBookClose={handleModalClose}
            handleBookAdded={handleBookAdded}
          />
        )}

        {showAddStudentModal && (
          <AddStudent
            showModal={showAddStudentModal}
            handleModalClose={handleAddStudentModalClose}
            handleStudentAdded={handleStudentAdded}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Menu right isOpen={menuOpen} onStateChange={handleMenuStateChange}>
        <div
          className="menu-item"
          onClick={handleOpenParametresModal}
          onKeyDown={handleOpenParametresModal}
        >
          <strong>Paramètres</strong>
        </div>
        <div
          className="menu-item"
          onClick={handleLogout}
          onKeyDown={handleLogout}
        >
          <strong>Se déconnecter</strong>
        </div>
      </Menu>
      <section className="section-eleves">
        <p className="intro">
          {nbOfStudents > 1
            ? `J'ai ${nbOfStudents} élèves enregistrés :`
            : `J'ai ${nbOfStudents} élève enregistré :`}
        </p>
        <section className="statistiques-liste">
          <div className="stats-item">
            <span className="badge badge-green">
              {studentsWithLoansInProgress}
            </span>
            <p className="texte-stat-item">
              {studentsWithLoansInProgress > 1
                ? "ont un emprunt en cours;"
                : "a un emprunt en cours;"}
            </p>
          </div>
          <div className="stats-item">
            <span className="badge badge-orange">
              {studentsWithLoansDueIn7Days}
            </span>
            <p className="texte-stat-item">
              {studentsWithLoansDueIn7Days > 1
                ? "doivent rendre au moins 1 livre dans moins de 7 jours;"
                : "doit rendre au moins 1 livre dans moins de 7 jours;"}
            </p>
          </div>
          <div className="stats-item">
            <span className="badge badge-red">{studentsWithOverdueLoans}</span>
            <p className="texte-stat-item">
              {studentsWithOverdueLoans > 1
                ? "sont en retard."
                : "est en retard."}
            </p>
          </div>
        </section>
        <div className="button-container">
          <button type="button" className="button" onClick={handleClasseClick}>
            Voir ma classe
          </button>
        </div>
      </section>

      <section className="section-livres">
        <p className="intro">
          <span>
            {exemplaires && exemplaires.length > 1
              ? `J'ai ${exemplaires.length} livres enregistrés, `
              : `J'ai ${exemplaires ? exemplaires.length : 0} livre enregistré, `}
          </span>
          <span>
            {books > 1
              ? `dont ${books} références
          différentes :`
              : `dont ${books} référence
          différente :`}
          </span>
        </p>
        <p className="p-emprunt">
          {loansInProgress && loansInProgress.length > 1
            ? `${loansInProgress.length} sont actuellement empruntés.`
            : `${loansInProgress ? loansInProgress.length : 0} est actuellement emprunté.`}
        </p>
        <p className="p-emprunt">Les 3 livres les plus empruntés sont :</p>
        <div className="top-books">
          {topBooks.map((topBook) => (
            <div
              key={topBook.titre}
              className="book-card"
              onClick={() =>
                handleClick(
                  topBook.ISBN13,
                  topBook.titre,
                  topBook.couverture_img,
                  topBook.auteur,
                )
              }
              onKeyDown={() =>
                handleClick(
                  topBook.ISBN13,
                  topBook.titre,
                  topBook.couverture_img,
                  topBook.auteur,
                )
              }
            >
              <img
                src={topBook.couverture_img}
                alt={topBook.titre}
                className="book-image"
              />
            </div>
          ))}
        </div>
        <div className="button-container">
          <button
            type="button"
            className="button"
            onClick={handleBibliothequeClick}
          >
            Voir ma bibliothèque
          </button>
        </div>
      </section>

      <section className="loan-actions">
        <button
          type="button"
          className="action-button-emprunt"
          onClick={handleAddBorrowClick}
        >
          Nouvel emprunt
        </button>
        <button
          type="button"
          className="action-button-retour"
          onClick={handleAddReturnClick}
        >
          Nouveau retour
        </button>
      </section>
      {showReturnModal && (
        <ReturnBookModal
          showReturnModal={showReturnModal}
          handleReturnModalClose={handleReturnModalClose}
          setShowReturnModal={setShowReturnModal}
          setConfirmationReturnMessage={setConfirmationReturnMessage}
          setShowConfirmationReturnModal={setShowConfirmationReturnModal}
          updateLoanStats={updateLoanStats}
        />
      )}
      {showBorrowModal && (
        <BorrowBookModal
          showModal={showBorrowModal}
          handleBorrowModalClose={handleBorrowModalClose}
          handleBookBorrowed={handleBookBorrowed}
          availableExemplaires={availableExemplaires}
          setAvailableExemplaires={setAvailableExemplaires}
          loanDuration={loanDuration}
          setErrorLoanMessage={setErrorLoanMessage}
          errorLoanMessage={errorLoanMessage}
          setConfirmationStudent={setConfirmationStudent}
          setConfirmationBook={setConfirmationBook}
          setConfirmationDateRetour={setConfirmationDateRetour}
          borrowLimit={borrowLimit}
          students={students}
          updateLoanStats={updateLoanStats}
        />
      )}
      {showParametresModal && (
        <ParametresModal
          loanDuration={loanDuration}
          setLoanDuration={setLoanDuration}
          showModal={showParametresModal}
          handleModalClose={() => setShowParametresModal(false)}
          borrowLimit={borrowLimit}
          setBorrowLimit={setBorrowLimit}
        />
      )}
      {showConfirmationLoanModal && (
        <ConfirmationLoanModale
          confirmationStudent={confirmationStudent}
          confirmationBook={confirmationBook}
          confirmationDateRetour={confirmationDateRetour}
        />
      )}
      {showConfirmationReturnModal && (
        <ConfirmationReturnModale
          confirmationReturnMessage={confirmationReturnMessage}
        />
      )}
    </div>
  );
}
export default BiblioClasse;
