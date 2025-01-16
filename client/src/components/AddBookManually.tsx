import "../styles/AddBookManually.css";

interface AddBookManuallyProps {
  showModalBook: boolean;
  handleModalBookClose: () => void;
}

function AddBookManually({
  showModalBook,
  handleModalBookClose,
}: AddBookManuallyProps) {
  if (showModalBook === false) return null;

  return (
    <div className="overlay">
      <div
        className="Addbook"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-button-modal"
          onClick={handleModalBookClose}
        >
          x
        </button>
        <h2 className="h2modal">Entrez les informations du livre</h2>
      </div>
    </div>
  );
}

export default AddBookManually;
