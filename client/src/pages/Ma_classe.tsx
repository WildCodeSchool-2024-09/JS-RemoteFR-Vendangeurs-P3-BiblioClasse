import "../styles/ListeAffichage.css";
import { useEffect, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import Header from "../components/Header";
import Student from "../components/Student";
import "../styles/BurgerMenu.css";
import "../styles/Buttons.css";
import { Link } from "react-router-dom";
import AddStudent from "../components/AddStudent";
import SearchBar from "../components/Searchbar";

interface StudentProps {
  id: number;
  prenom: string;
  nom: string;
  returnDueDate: string;
  nbOfBooksBorrowed: number;
}

function Ma_classe() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [filteredStudents, setFilteredStudents] = useState<StudentProps[]>([]);
  const [sortStudents, setSortStudents] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [students, setStudents] = useState<StudentProps[]>([]);

  useEffect(() => {
    fetch("http://localhost:3310/api/eleves")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        setFilteredStudents(data);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des élèves:", error),
      );
  }, []);

  const handleMenuStateChange = (state: { isOpen: boolean }) => {
    setMenuOpen(state.isOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    console.info(students);
  };

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortStudents === "prenom") {
      return a.prenom.localeCompare(b.prenom);
    }
    if (sortStudents === "nom") {
      return a.nom.localeCompare(b.nom);
    }
    return 0;
  });

  const handleAddStudentClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSearchClick = (searchTerm: string) => {
    fetch(`http://localhost:3310/api/eleves/search?q=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        setFilteredStudents(data);
      })
      .catch((error) =>
        console.error("Erreur lors de la recherche des élèves:", error),
      );
  };

  return (
    <div>
      <Header />
      <Menu right isOpen={menuOpen} onStateChange={handleMenuStateChange}>
        <div className="menu-item">
          <strong>Editer la liste</strong>
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
        </div>
        <div className="menu-item">
          <Link to="/" onClick={closeMenu}>
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
          <Student
            key={student.id}
            id={student.id}
            prenom={student.prenom}
            nom={student.nom}
            returnDueDate={student.returnDueDate}
            nbOfBooksBorrowed={student.nbOfBooksBorrowed}
          />
        ))}
      </section>
      <div className="buttons">
        <button
          type="button"
          className="add_student_button"
          onClick={handleAddStudentClick}
        >
          +
        </button>
        <AddStudent showModal={showModal} handleModalClose={handleModalClose} />
        <SearchBar onSearch={handleSearchClick} />
      </div>
    </div>
  );
}

export default Ma_classe;
