import "../styles/ListeAffichage.css";
import { useEffect, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import Header from "../components/Header";
import Student from "../components/Student";
import "../styles/BurgerMenu.css";
import "../styles/Buttons.css";
import { Link, useNavigate } from "react-router-dom";
import AddStudent from "../components/AddStudent";
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

  /*Gère le retour à la page précédente*/
  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    fetch("http://localhost:3310/api/eleves")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        setFilteredStudents(data);
        console.info("Elèves récupérés:", data);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des élèves:", error),
      );
  }, []);

  /*Récupération des élèves*/
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:3310/api/eleves");
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des livres:", error);
      }
    };

    fetchStudents();
  }, []);

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

  /*Fonction pour supprimer un livre*/
  const handleDeleteStudent = async (id_eleve: number) => {
    try {
      const response = await fetch(
        `http://localhost:3310/api/eleves/${id_eleve}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.id_eleve !== id_eleve),
        );
        setFilteredStudents((prevStudents) =>
          prevStudents.filter((student) => student.id_eleve !== id_eleve),
        );
      } else {
        console.error("Erreur lors de la suppression du livre");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du livre:", error);
    }
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
        <div className="menu-item">
          <strong>Paramètres</strong>
        </div>
        <div className="menu-item">
          <strong>Se déconnecter</strong>
        </div>
      </Menu>
      <section className="Ma_classe">
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
