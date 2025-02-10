import "../styles/AddBook.css";

interface AddBookProps {
  showModal: boolean;
  handleModalClose: () => void;
  handleAddBookManuallyClick: () => void;
  handleAddBookScanClick: () => void;
}

function AddBook({
  showModal,
  handleModalClose,
  handleAddBookManuallyClick,
  handleAddBookScanClick,
}: AddBookProps) {
  if (showModal === false) return null;

  return (
    <div
      className="overlay"
      onClick={handleModalClose}
      onKeyDown={handleModalClose}
    >
      <div
        className="AddBook"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-button-modal"
          onClick={handleModalClose}
        >
          x
        </button>
        <h2 className="h2modal">Ajouter un livre</h2>
        <p className="pmodal">Comment souhaitez-vous ajouter votre livre ?</p>
        <div className="buttons-modal">
          <button
            type="button"
            className="button-modal-left"
            onClick={handleAddBookScanClick}
          >
            Scanner
          </button>
          <button
            type="button"
            className="button-modal-right"
            onClick={handleAddBookManuallyClick}
          >
            Ajouter manuellement
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBook;
