import "../styles/Student.css";
import { useNavigate } from "react-router-dom";
import Nb_livres_a_rendre from "./Nb_livres_a_rendre";

interface StudentProps {
  id: number;
  firstName: string;
  lastName: string;
  returnDueDate: string;
  nbOfBooksBorrowed: number;
}

function Student({
  id,
  firstName,
  lastName,
  returnDueDate,
  nbOfBooksBorrowed,
}: StudentProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/eleve/${id}`, {
      state: { firstName, lastName, returnDueDate, nbOfBooksBorrowed, id },
    });
  };

  const calculateDaysLeft = (dueDate: string) => {
    const currentDate = new Date();
    const returnDate = new Date(dueDate);
    const timeDiff = returnDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const daysLeft = calculateDaysLeft(returnDueDate);
  let className = "Student";

  if (daysLeft > 7) {
    className += " green";
  } else if (daysLeft >= 0 && daysLeft <= 7) {
    className += " orange";
  } else {
    className += " red";
  }

  return (
    <div className={className} onClick={handleClick} onKeyPress={handleClick}>
      <Nb_livres_a_rendre nbOfBooksBorrowed={nbOfBooksBorrowed} />
      <section className="Infos_retour_livre">
        <p className="Lastname_name">
          {firstName} {lastName}
        </p>
        <p className="Return_due_date">A rendre avant le {returnDueDate}</p>
      </section>
    </div>
  );
}

export default Student;
