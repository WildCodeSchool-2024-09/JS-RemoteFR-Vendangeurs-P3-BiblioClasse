import "../styles/Nb_livres_a_rendre.css";

function Nb_livres_a_rendre({
  nbOfBooksBorrowed,
}: { nbOfBooksBorrowed: number }) {
  return (
    <div className="Nb_livres_a_rendre">
      <p className="Number_of_books_to_return">{nbOfBooksBorrowed}</p>
    </div>
  );
}

export default Nb_livres_a_rendre;
