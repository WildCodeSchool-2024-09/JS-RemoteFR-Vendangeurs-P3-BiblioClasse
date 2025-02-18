import "../styles/ConfirmationReturnModale.css";

interface ConfirmationReturnModaleProps {
  confirmationReturnMessage?: string;
}

function ConfirmationReturnModale({
  confirmationReturnMessage,
}: ConfirmationReturnModaleProps) {
  return (
    <div className="overlay">
      <div
        className="confirmation-return-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <h2 className="h2confirmation-return-modal">
          {confirmationReturnMessage}
        </h2>
      </div>
    </div>
  );
}

export default ConfirmationReturnModale;
