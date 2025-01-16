import "../styles/Mon_livre.css";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Mon_livre() {
  const location = useLocation();
  const navigate = useNavigate();
  const { titre, auteur, resume, couverture_img, isbn } = location.state;

  console.info(titre, auteur, resume, couverture_img, isbn);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddBorrowClick = () => {
    // logique pour ajouter un emprunt
    console.info("Add book borrow");
  };

  return (
    <div>
      <Header />
      <section className="Mon_livre">
        <div>
          <figure className="bookCover_container">
            <img
              className="bookCover_image"
              src={couverture_img}
              alt="couverture"
            />
          </figure>
        </div>
        <div className="infos_livre">
          <p className="exemplaire">2 exemplaires disponibles sur 3</p>
          <p className="titre">{titre}</p>
          <p className="auteur">De : {auteur}</p>
          <p className="isbn">ISBN: {isbn}</p>
          <p className="resume">{resume}</p>
        </div>
      </section>
      <div className="buttons">
        <button type="button" className="back_button" onClick={handleBackClick}>
          &#8617;
        </button>
        <button
          type="button"
          className="add_borrow_button"
          onClick={handleAddBorrowClick}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Mon_livre;
