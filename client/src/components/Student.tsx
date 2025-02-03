import "../styles/Student.css";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import Nb_livres_a_rendre from "./Nb_livres_a_rendre";

interface StudentProps {
  id_eleve: number;
  prenom: string;
  nom: string;
  date_retour: string;
  nbOfBooksBorrowed: number;
  context: "mon_livre" | "classe";
}

function Student({
  id_eleve,
  nom,
  prenom,
  date_retour,
  nbOfBooksBorrowed,
  context,
}: StudentProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/eleve/${id_eleve}`, {
      state: { prenom, nom, date_retour, nbOfBooksBorrowed, id_eleve },
    });
  };

  /*formatage de la date de retour pour une meilleure lecture*/
  const formattedDateRetour = date_retour
    ? format(new Date(date_retour), "EEEE dd MMMM yyyy", { locale: fr })
    : null;

  /*calcul du nombre de jours restants avant la date de retour*/
  const calculateDaysLeft = (date_retour: string) => {
    const currentDate = new Date();
    const returnDate = new Date(date_retour);
    const timeDiff = returnDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  /*définition de la couleur du cadre en fonction du nombre de jours restants avant la date de retour*/
  const daysLeft = date_retour ? calculateDaysLeft(date_retour) : null;
  let className = "BookColor";

  if (daysLeft !== null) {
    if (daysLeft > 7) {
      className += " green";
    } else if (daysLeft >= 0 && daysLeft <= 7) {
      className += " orange";
    } else {
      className += " red";
    }
  }
  return (
    <div
      className={`Student ${className}`}
      onClick={handleClick}
      onKeyUp={handleClick}
    >
      {context === "classe" && (
        <>
          <Nb_livres_a_rendre nbOfBooksBorrowed={nbOfBooksBorrowed} />
          <section className="Infos_retour_livre">
            <p className="Lastname_name">
              {prenom} {nom}
            </p>
            <p className="Return_due_date">
              A rendre avant le {formattedDateRetour}
            </p>
          </section>
        </>
      )}
      {context === "mon_livre" && (
        <section className="Infos_retour_livre">
          <p className="Lastname_name">
            {prenom} {nom}
          </p>
          <p className="Return_due_date">
            A rendre avant le {formattedDateRetour}
          </p>
        </section>
      )}
    </div>
  );
}

export default Student;
