import "../styles/DeleteConfirmationModale.css";

interface DeleteConfirmationModaleProps {
  showDeleteConfirmationModale: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModale = ({
  showDeleteConfirmationModale,
  message,
  onConfirm,
  onCancel,
}: DeleteConfirmationModaleProps) => {
  if (!showDeleteConfirmationModale) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button
            type="button"
            onClick={onConfirm}
            onKeyDown={onConfirm}
            className="confirm-button"
          >
            Confirmer
          </button>
          <button
            type="button"
            onClick={onCancel}
            onKeyDown={onCancel}
            className="cancel-button"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModale;
