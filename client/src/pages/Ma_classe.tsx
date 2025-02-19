import { useEffect, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import Header from "../components/Header";
import Student from "../components/Student";
import { useAuth } from "../context/AuthContext";
import "../styles/ListeAffichage.css";
import "../styles/BurgerMenu.css";
import "../styles/Buttons.css";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import AddStudent from "../components/AddStudent";
import DeleteConfirmationModale from "../components/DeleteConfirmationModale";
import SearchBar from "../components/Searchbar";

export interface StudentProps {
  id_eleve: number;
  prenom: string;
  nom: string;
  date_retour: string;
  nbOfBooksBorrowed: number;
}

function Ma_classe() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentProps[]>([]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [filteredStudents, setFilteredStudents] = useState<StudentProps[]>([]);
  const [sortStudents, setSortStudents] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentProps | null>(
    null,
  );
  const { userId, setUserId } = useAuth();
  const [showDeleteConfirmationModale, setShowDeleteConfirmationModale] =
    useState(false);

  /*Gère le retour à la page précédente*/
  const handleBackClick = () => {
    navigate(-1);
  };

  /*Récupération des élèves*/
  useEffect(() => {
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${userId}/eleves_with_borrows_information`,
        );
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des livres:", error);
      }
    };

    fetchStudents();
  }, [userId, setUserId]);

  /*Gère l'ouverture et la fermeture du menu tiroir*/
  const handleMenuStateChange = (state: { isOpen: boolean }) => {
    setMenuOpen(state.isOpen);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };

  /*Fonction pour trier les élèves par nom ou par prénom*/
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortStudents === "prenom") {
      return a.prenom.localeCompare(b.prenom);
    }
    if (sortStudents === "nom") {
      return a.nom.localeCompare(b.nom);
    }
    if (sortStudents === "date_retour") {
      return a.date_retour.localeCompare(b.date_retour);
    }
    return 0;
  });

  /*Gère l'ouverture et la fermeturer du modal pour ajouter un élève*/
  const handleAddStudentClick = () => {
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  /*Fonction pour rechercher un élève*/
  const handleSearchClick = (searchTerm: string) => {
    const filtered = students.filter(
      (student) =>
        student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.prenom.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredStudents(filtered);
  };

  /*Fonction pour mettre à jour la liste des élèves après en avoir ajouté un*/
  const handleStudentAdded = (newStudent: StudentProps) => {
    setStudents((prevStudents) => [...prevStudents, newStudent]);
    setFilteredStudents((prevStudents) => [...prevStudents, newStudent]);
  };

  /*Fonction pour éditer la liste*/
  const handleEditListClick = () => {
    setEditMode(!editMode);
    setMenuOpen(false);
  };

  /* Fonction pour afficher la modale de confirmation */
  const handleDeleteConfirmationModale = (student: StudentProps) => {
    setStudentToDelete(student);
    setShowDeleteConfirmationModale(true);
  };

  /* Fonction pour supprimer un élève */
  const handleDeleteStudent = (id_eleve: number) => {
    const student = students.find((student) => student.id_eleve === id_eleve);
    if (student) {
      handleDeleteConfirmationModale(student);
    }
  };

  /* Fonction pour confirmer la suppression */
  const handleConfirmDelete = async () => {
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    if (!studentToDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/${userId}/eleves/${studentToDelete.id_eleve}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setStudents((prevStudents) =>
          prevStudents.filter(
            (student) => student.id_eleve !== studentToDelete.id_eleve,
          ),
        );
        setFilteredStudents((prevStudents) =>
          prevStudents.filter(
            (student) => student.id_eleve !== studentToDelete.id_eleve,
          ),
        );
        setShowDeleteConfirmationModale(false);
        setStudentToDelete(null);
      } else {
        console.error("Erreur lors de la suppression de l'élève");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'élève:", error);
    }
  };

  /* Fonction pour annuler la suppression */
  const handleCancelDelete = () => {
    setShowDeleteConfirmationModale(false);
    setStudentToDelete(null);
  };

  return (
    <div>
      <Header />
      {editMode && (
        <div className="delete-mode-banner">
          <p>Cliquez sur un élève pour le supprimer.</p>
          <button
            onClick={handleEditListClick}
            className="exit-delete-mode-button"
            type="button"
          >
            Quitter le mode suppression
          </button>
        </div>
      )}
      <Menu right isOpen={menuOpen} onStateChange={handleMenuStateChange}>
        <div className="menu-item">
          <button
            onClick={handleEditListClick}
            type="button"
            className="edit-button-bm"
          >
            Modifier la liste
          </button>
        </div>
        <div className="menu-item">
          <strong>Trier par :</strong>
        </div>
        <div className="menu-item">
          <label className="radio">
            <input
              type="radio"
              name="sort"
              value="prenom"
              checked={sortStudents === "prenom"}
              onChange={() => {
                setSortStudents("prenom");
                closeMenu();
              }}
            />
            Trier par prénom
          </label>
        </div>
        <div className="menu-item">
          <label className="radio">
            <input
              type="radio"
              name="sort"
              value="nom"
              checked={sortStudents === "nom"}
              onChange={() => {
                setSortStudents("nom");
                closeMenu();
              }}
            />
            Trier par nom
          </label>
          <label className="radio">
            <input
              type="radio"
              name="sort"
              value="date_retour"
              checked={sortStudents === "date_retour"}
              onChange={() => {
                setSortStudents("date_retour");
                closeMenu();
              }}
            />
            Trier par date retour
          </label>
        </div>
        <div className="menu-item">
          <Link to="/accueil" onClick={closeMenu}>
            <strong>Accueil</strong>
          </Link>
        </div>
      </Menu>
      <section className={`Ma_classe ${editMode ? "edit-mode" : ""}`}>
        {sortedStudents.map((student) => (
          <div key={student.id_eleve}>
            <div
              key={student.id_eleve}
              className={`book-container ${editMode ? "delete-mode" : ""}`}
              onContextMenu={(e) => {
                e.preventDefault();
                if (editMode) {
                  handleDeleteStudent(student.id_eleve);
                }
              }}
            >
              <Student
                key={student.id_eleve}
                id_eleve={student.id_eleve}
                prenom={student.prenom}
                nom={student.nom}
                date_retour={student.date_retour}
                nbOfBooksBorrowed={student.nbOfBooksBorrowed}
                context="classe"
              />
              {editMode && (
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeleteStudent(student.id_eleve)}
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        ))}
        <DeleteConfirmationModale
          showDeleteConfirmationModale={showDeleteConfirmationModale}
          message={`Êtes-vous sûr de vouloir supprimer ${studentToDelete?.prenom} ${studentToDelete?.nom} ? Une fois la suppression validée, vous ne pourrez plus revenir en arrière.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </section>
      {!editMode && (
        <div className="buttons">
          <button
            type="button"
            className="add_student_button"
            onClick={handleAddStudentClick}
          >
            +
          </button>
          <AddStudent
            showModal={showModal}
            handleModalClose={handleModalClose}
            handleStudentAdded={handleStudentAdded}
          />
          <button
            type="button"
            className="back_button_classe"
            onClick={handleBackClick}
          >
            &#8617;
          </button>
          <SearchBar onSearch={handleSearchClick} />
        </div>
      )}
    </div>
  );
}

export default Ma_classe;
