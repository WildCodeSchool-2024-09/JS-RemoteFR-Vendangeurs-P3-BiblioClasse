import "../styles/ParametresModal.css";

interface ParametresProps {
  loanDuration: number;
  setLoanDuration: (duration: number) => void;
  showModal: boolean;
  handleModalClose: () => void;
}

function ParametresModal({
  loanDuration,
  setLoanDuration,
  showModal,
  handleModalClose,
}: ParametresProps) {
  if (!showModal) return null;

  const handleIncrement = () => {
    setLoanDuration(loanDuration + 1);
  };

  const handleDecrement = () => {
    setLoanDuration(loanDuration > 1 ? loanDuration - 1 : 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3310/api/parametres/loanDuration", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loanDuration }),
      });
      console.info("Durée d'emprunt mise à jour avec succès :", {
        loanDuration,
      });
      handleModalClose();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la durée d'emprunt:",
        error,
      );
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
        <form onSubmit={handleSubmit}>
          <div className="parametres-item">
            <label htmlFor="loanDuration">
              Durée d'emprunt souhaitée (jours) :
            </label>
            <div className="quantity-control">
              <button
                type="button"
                className="quantity-setter-button"
                onClick={handleDecrement}
              >
                -
              </button>
              <span className="span-quantity">{loanDuration}</span>
              <button
                type="button"
                className="quantity-setter-button"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          </div>
          <p className="parametres-info">
            Attention, les dates retour des emprunts en cours ne seront pas
            modifiées
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
