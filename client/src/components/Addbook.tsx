import "../styles/Addbook.css";

interface AddBookProps {
  showModal: boolean;
  handleModalClose: () => void;
  handleAddBookManuallyClick: () => void;
}

function AddBook({
  showModal,
  handleModalClose,
  handleAddBookManuallyClick,
}: AddBookProps) {
  if (showModal === false) return null;

  /*Gère le scan du livre*/
  const handleScan = () => {
    console.info("scan");
    handleModalClose();
  };

  return (
    <div
      className="overlay"
      onClick={handleModalClose}
      onKeyDown={handleModalClose}
    >
      <div
        className="Addbook"
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
            onClick={handleScan}
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
