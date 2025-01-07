import "../styles/Student.css";

interface BookProps {
  id: number;
  titre: string;
  auteur: string;
  resume: string;
  image: string;
  isbn: string;
}

function Book({ titre, image }: BookProps) {
  return (
    <div className="Book">
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
