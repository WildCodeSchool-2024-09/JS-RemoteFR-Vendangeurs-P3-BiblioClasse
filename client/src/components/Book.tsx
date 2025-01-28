import "../styles/Student.css";
import { useNavigate } from "react-router-dom";

interface BookProps {
  titre: string;
  auteur: string;
  livre_resume: string;
  couverture_img: string;
  ISBN: string;
}

function Book({
  titre,
  couverture_img,
  auteur,
  livre_resume,
  ISBN,
}: BookProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/livre/${ISBN}`, {
      state: { titre, auteur, livre_resume, couverture_img, ISBN },
    });
  };

  return (
    <div className="Book" onClick={handleClick} onKeyUp={handleClick}>
      <figure className="Image_livre_container">
        <img src={couverture_img} alt={titre} />
      </figure>
      <section className="Infos_livre">
        <p className="Titre">{titre}</p>
        <p className="Auteur">{auteur}</p>
        <p className="Emprunte">Emprunté par Marie Curie</p>
      </section>
    </div>
  );
}

export default Book;
