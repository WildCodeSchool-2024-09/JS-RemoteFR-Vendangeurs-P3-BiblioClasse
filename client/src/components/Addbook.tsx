import "../styles/Addbook.css";
import AddBookManually from "./AddBookManually";

interface AddbookProps {
  showModal: boolean;
  handleModalClose: () => void;
  showModalBook: boolean;
  setShowModalBook: (show: boolean) => void;
}

function Addbook({
  showModal,
  handleModalClose,
  setShowModalBook,
  showModalBook,
}: AddbookProps) {
  if (showModal === false) return null;

  /*Gère le scan du livre*/
  const handleScan = () => {
    console.info("scan");
    handleModalClose();
  };

  /*Gère l'ouverture de la modal pour ajouter un livre manuellement*/
  const handleAddBookManually = () => {
    setShowModalBook(true);
    console.info("add book manually");
  };

  /*Gère la fermeture de la modal pour ajouter un livre manuellement*/
  const handleModalBookClose = () => {
    setShowModalBook(false);
  };

  /*Gère l'ajout d'un livre manuellement et ferme la modal*/
  const handleAddBookAndClose = () => {
    handleAddBookManually();
    handleModalClose();
    console.info(`showModalBook is : ${showModalBook}`);
    console.info(`showModal is : ${showModal}`);
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
            onClick={handleAddBookAndClose}
          >
            Ajouter manuellement
          </button>
        </div>
      </div>
      {showModalBook && (
        <AddBookManually
          showModalBook={showModalBook}
          handleModalBookClose={handleModalBookClose}
        />
      )}
    </div>
  );
}

export default Addbook;
