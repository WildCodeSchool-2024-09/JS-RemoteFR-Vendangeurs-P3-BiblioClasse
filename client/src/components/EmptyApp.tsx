import "../styles/Addbook.css";

interface EmptyAppProps {
  onAddBookClick: () => void;
  onAddStudentClick: () => void;
  onClose: () => void;
}

function EmptyApp({
  onAddBookClick,
  onAddStudentClick,
  onClose,
}: EmptyAppProps) {
  return (
    <div className="overlay" onClick={onClose} onKeyDown={onClose}>
      <div
        className="Addbook"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="close-button-modal" onClick={onClose}>
          x
        </button>
        <h2 className="h2modal">C'est bien vide par ici ...</h2>
        <div className="buttons-modal">
          <button
            type="button"
            className="button-modal-left"
            onClick={onAddStudentClick}
          >
            Ajouter un élève
          </button>
          <button
            type="button"
            className="button-modal-right"
            onClick={onAddBookClick}
          >
            Ajouter un livre
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmptyApp;
