import "../styles/Mon_eleve.css";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/Buttons.css";

function Mon_eleve() {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName, lastName, nbOfBooksBorrowed } = location.state;

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
      <section className="Mon_eleve">
        <div>
          <figure className="QRCode_container">
            <img src="/src/assets/images/QRCode.png" alt="QRCode" />
          </figure>
        </div>
        <div className="infos_eleve">
          <p className="name">{firstName}</p>
          <p className="name">{lastName}</p>
          <p className="infos_livre">
            {nbOfBooksBorrowed} livres empruntés, dont 1 en retard
          </p>
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

export default Mon_eleve;
