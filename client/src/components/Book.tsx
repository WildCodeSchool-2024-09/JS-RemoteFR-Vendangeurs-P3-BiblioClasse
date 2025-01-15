import "../styles/Student.css";
import { useNavigate } from "react-router-dom";

interface BookProps {
  id: number;
  titre: string;
  auteur: string;
  resume: string;
  image: string;
  isbn: string;
}

function Book({ id, titre, image, auteur, resume, isbn }: BookProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/livre/${id}`, {
      state: { titre, auteur, resume, image, isbn },
    });
  };

  return (
    <div className="Book" onClick={handleClick} onKeyUp={handleClick}>
      <figure className="Image_livre_container">
        <img src={image} alt={titre} />
      </figure>
      <section className="Infos_livre">
        <p className="Titre">{titre}</p>
        <p className="Emprunte">Emprunté par Marie Curie</p>
      </section>
    </div>
  );
}

export default Book;
