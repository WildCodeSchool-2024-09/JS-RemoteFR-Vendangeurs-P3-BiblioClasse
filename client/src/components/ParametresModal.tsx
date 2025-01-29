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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleModalClose();
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
          <button type="submit" className="submit-button">
            Valider
          </button>
        </form>
      </div>
    </div>
  );
}

export default ParametresModal;
