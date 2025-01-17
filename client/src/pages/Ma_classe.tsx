import "../styles/ListeAffichage.css";
import { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import Header from "../components/Header";
import Student from "../components/Student";
import "../styles/BurgerMenu.css";
import "../styles/Buttons.css";
import { Link } from "react-router-dom";
import AddStudent from "../components/AddStudent";
import SearchBar from "../components/Searchbar";

const fakeStudents = [
  {
    id: 1,
    firstName: "Louisette",
    lastName: "Gehin-Nomtrellont-Vreman-Tretrellont",
    returnDueDate: "2024/12/15",
    nbOfBooksBorrowed: 3,
  },
  {
    id: 2,
    firstName: "Jean",
    lastName: "Dupont",
    returnDueDate: "2025/07/15",
    nbOfBooksBorrowed: 2,
  },
  {
    id: 3,
    firstName: "Marie",
    lastName: "Curie",
    returnDueDate: "2024/12/21",
    nbOfBooksBorrowed: 1,
  },
  {
    id: 4,
    firstName: "Albert",
    lastName: "Einstein",
    returnDueDate: "2024/12/08",
    nbOfBooksBorrowed: 4,
  },
  {
    id: 5,
    firstName: "Isaac",
    lastName: "Newton",
    returnDueDate: "2025/02/15",
    nbOfBooksBorrowed: 2,
  },
  {
    id: 6,
    firstName: "Galileo",
    lastName: "Galilei",
    returnDueDate: "2025/08/10",
    nbOfBooksBorrowed: 3,
  },
  {
    id: 7,
    firstName: "Nikola",
    lastName: "Tesla",
    returnDueDate: "2024/12/24",
    nbOfBooksBorrowed: 1,
  },
  {
    id: 8,
    firstName: "Ada",
    lastName: "Lovelace",
    returnDueDate: "2025/06/14",
    nbOfBooksBorrowed: 2,
  },
  {
    id: 9,
    firstName: "Charles",
    lastName: "Darwin",
    returnDueDate: "2025/03/14",
    nbOfBooksBorrowed: 3,
  },
  {
    id: 10,
    firstName: "Rosalind",
    lastName: "Franklin",
    returnDueDate: "2024/12/31",
    nbOfBooksBorrowed: 4,
  },
];

function Ma_classe() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [filteredStudents, setFilteredStudents] = useState(fakeStudents);
  const [sortStudents, setSortStudents] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleMenuStateChange = (state: { isOpen: boolean }) => {
    setMenuOpen(state.isOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortStudents === "firstName") {
      return a.firstName.localeCompare(b.firstName);
    }
    if (sortStudents === "lastName") {
      return a.lastName.localeCompare(b.lastName);
    }
    return 0;
  });

  const handleAddStudentClick = () => {
    setShowModal(true);
    console.info("Add student");
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSearchClick = (searchTerm: string) => {
    const filtered = fakeStudents.filter((student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredStudents(filtered);
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
          <label>
            <input
              type="radio"
              name="sort"
              value="prénom"
              checked={sortStudents === "firstName"}
              onChange={() => {
                setSortStudents("firstName");
                closeMenu();
              }}
            />
            Trier par prénom
          </label>
        </div>
        <div className="menu-item">
          <label>
            <input
              type="radio"
              name="sort"
              value="nom"
              checked={sortStudents === "lastName"}
              onChange={() => {
                setSortStudents("lastName");
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
            firstName={student.firstName}
            lastName={student.lastName}
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
