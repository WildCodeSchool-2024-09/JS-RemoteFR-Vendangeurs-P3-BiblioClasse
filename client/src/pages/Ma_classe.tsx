import "../styles/ListeAffichage.css";
import Header from "../components/Header";
import Student from "../components/Student";

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
  return (
    <div>
      <Header />
      <section className="Ma_classe">
        {fakeStudents.map((student) => (
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
    </div>
  );
}

export default Ma_classe;
