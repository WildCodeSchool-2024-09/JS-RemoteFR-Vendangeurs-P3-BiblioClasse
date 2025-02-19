import "../styles/ParametresModal.css";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";

interface ParametresProps {
  loanDuration: number;
  setLoanDuration: (duration: number) => void;
  showModal: boolean;
  handleModalClose: () => void;
  borrowLimit: number;
  setBorrowLimit: (limit: number) => void;
}

function ParametresModal({
  loanDuration,
  setLoanDuration,
  showModal,
  handleModalClose,
  borrowLimit,
  setBorrowLimit,
}: ParametresProps) {
  const { userId, setUserId } = useAuth();
  if (!showModal) return null;

  /*Gère l'incrément/décrement de la durée d'emprunt et le nombre de livres empruntables simultanément*/
  const handleIncrementLoanDuration = () => {
    setLoanDuration(loanDuration + 1);
  };
  const handleDecrementLoanDuration = () => {
    setLoanDuration(loanDuration > 1 ? loanDuration - 1 : 1);
  };
  const handleIncrementBorrowLimit = () => {
    setBorrowLimit(borrowLimit + 1);
  };
  const handleDecrementBorrowLimit = () => {
    setBorrowLimit(borrowLimit > 1 ? borrowLimit - 1 : 1);
  };

  /*Gère l'envoi de la durée d'emprunt et de la limite du nombre de livres au back*/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/${userId}/parametres/loanDuration`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ loanDuration }),
        },
      );
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/${userId}/parametres/borrowLimit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ borrowLimit }),
        },
      );
      handleModalClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres :", error);
    }
  };

  return (
    <div
      className="overlay"
      onClick={handleModalClose}
      onKeyDown={handleModalClose}
    >
      <div
        className="parametres-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyUp={handleModalClose}
      >
        <button
          type="button"
          className="close-button-modal"
          onClick={handleModalClose}
        >
          &times;
        </button>
        <h2 className="h2modalParam">Paramètres</h2>
        <form id="durée-d-emprunt" onSubmit={handleSubmit}>
          <div className="parametres-item">
            <label htmlFor="loanDuration">
              Durée d'emprunt souhaitée (jours)* :
            </label>
            <div className="quantity-control">
              <button
                type="button"
                className="quantity-setter-button"
                onClick={handleDecrementLoanDuration}
              >
                -
              </button>
              <span className="span-quantity">{loanDuration}</span>
              <button
                type="button"
                className="quantity-setter-button"
                onClick={handleIncrementLoanDuration}
              >
                +
              </button>
            </div>
          </div>
          <p className="parametres-info">
            *Les dates retour des emprunts en cours ne seront pas modifiées
          </p>
          <div className="parametres-item">
            <label htmlFor="borrowLimit">
              Nombre de livres empruntables simultanément* :
            </label>
            <div className="quantity-control">
              <button
                type="button"
                className="quantity-setter-button"
                onClick={handleDecrementBorrowLimit}
              >
                -
              </button>
              <span className="span-quantity">{borrowLimit}</span>
              <button
                type="button"
                className="quantity-setter-button"
                onClick={handleIncrementBorrowLimit}
              >
                +
              </button>
            </div>
          </div>
          <p className="parametres-info">
            *Les emprunts en cours ne seront pas affectés
          </p>
          <button type="submit" className="submit-button">
            Valider
          </button>
        </form>
      </div>
    </div>
  );
}

export default ParametresModal;
