import "../styles/Student.css";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface BookProps {
  titre: string;
  auteur: string;
  livre_resume: string;
  couverture_img: string;
  ISBN: string;
  date_retour?: string | null;
  context: "mon_eleve" | "bibliotheque";
}

function Book({
  titre,
  couverture_img,
  auteur,
  livre_resume,
  ISBN,
  date_retour,
  context,
}: BookProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/livre/${ISBN}`, {
      state: { titre, auteur, livre_resume, couverture_img, ISBN, date_retour },
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
      className={`Book ${className}`}
      onClick={handleClick}
      onKeyUp={handleClick}
    >
      <figure className="Image_livre_container">
        <img src={couverture_img} alt={titre} />
      </figure>
      {context === "bibliotheque" && (
        <section className="Infos_livre">
          <p className="Titre">{titre}</p>
          <p className="Auteur">{auteur}</p>
          <p className="Dispo">1 exemplaire(s) disponible(s) sur les 10</p>
        </section>
      )}
      {context === "mon_eleve" && (
        <section className="Infos_livre">
          <p className="Titre">{titre}</p>
          <p className="Auteur">
            {date_retour
              ? `A rendre avant le : ${formattedDateRetour}`
              : "Pas de date de retour"}
          </p>
        </section>
      )}
    </div>
  );
}

export default Book;
