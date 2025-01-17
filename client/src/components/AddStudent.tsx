import "../styles/AddStudent.css";

interface AddStudentProps {
  showModal: boolean;
  handleModalClose: () => void;
}

function AddStudent({ showModal, handleModalClose }: AddStudentProps) {
  if (showModal === false) return null;

  return (
    <div
      className="overlay"
      onClick={handleModalClose}
      onKeyDown={handleModalClose}
    >
      <div
        className="AddStudent"
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
        <h2 className="h2modal">Ajouter un élève</h2>
        {/*formulaire d'ajout d'un élève*/}
        <form className="form-modal">
          <label>
            Prénom :
            <input type="text" name="firstName" placeholder="Prénom..." />
          </label>
          <label>
            Nom :
            <input type="text" name="lastName" placeholder="Nom..." />
          </label>
          <button type="submit" className="button-modal-all">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
