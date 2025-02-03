import "../styles/ConfirmationLoanModale.css";

interface ConfirmationLoanModaleProps {
  confirmationLoanMessage: string;
}

function ConfirmationLoanModale({
  confirmationLoanMessage,
}: ConfirmationLoanModaleProps) {
  return (
    <div className="overlay">
      <div
        className="confirmation-loan-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <h2 className="confirmation-loan-message">{confirmationLoanMessage}</h2>
      </div>
    </div>
  );
}

export default ConfirmationLoanModale;
