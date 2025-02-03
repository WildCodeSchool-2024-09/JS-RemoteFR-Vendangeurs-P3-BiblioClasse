import "../styles/ConfirmationLoanModale.css";

interface ConfirmationLoanModaleProps {
  confirmationStudent: string;
  confirmationBook: string;
  confirmationDateRetour: string;
}

function ConfirmationLoanModale({
  confirmationStudent,
  confirmationBook,
  confirmationDateRetour,
}: ConfirmationLoanModaleProps) {
  return (
    <div className="overlay">
      <div
        className="confirmation-loan-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <h2 className="h2confirmation-loan-modal">Nouvel emprunt confirmé !</h2>
        <p className="confirmation-details">
          L'emprunt suivant a bien été enregistré :
        </p>
        <ul>
          <li>
            <span className="label-confirmation-loan-message">Eleve :</span>{" "}
            <span className="value-confirmation-loan-message">
              {confirmationStudent}
            </span>
          </li>
          <li>
            <span className="label-confirmation-loan-message">
              Livre emprunté :
            </span>{" "}
            <span className="value-confirmation-loan-message">
              "{confirmationBook}"
            </span>
          </li>
          <li>
            <span className="label-confirmation-loan-message">
              Date retour :
            </span>{" "}
            <span className="value-confirmation-loan-message">
              {confirmationDateRetour}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ConfirmationLoanModale;
