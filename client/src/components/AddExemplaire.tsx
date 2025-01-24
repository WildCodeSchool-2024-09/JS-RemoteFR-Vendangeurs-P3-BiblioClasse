import "../styles/Mon_livre.css";
interface AddExemplaireProps {
  onExemplaireAdded: (exemplaire: {
    id_exemplaire: number;
    ISBN: string;
    isAvailable: boolean;
  }) => void;
  handleModalClose: () => void;
  ISBN: string;
}

function AddExemplaire({
  ISBN,
  onExemplaireAdded,
  handleModalClose,
}: AddExemplaireProps) {
  const isAvailable = true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3310/api/exemplaires", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ISBN, isAvailable }),
    });

    if (response.ok) {
      const newExemplaire = await response.json();
      onExemplaireAdded(newExemplaire);
      handleModalClose();
    } else {
      console.error("Erreur lors de l'ajout de l'exemplaire");
    }
  };

  return (
    <div
      className="overlay"
      onClick={handleModalClose}
      onKeyUp={handleModalClose}
    >
      <div
        className="AddExemplaireModal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-button-modal"
          onClick={handleModalClose}
        >
          &times;
        </button>
        <h2 className="h2modal">Ajouter un exemplaire ?</h2>
        <form onSubmit={handleSubmit} className="form-exemplaire">
          <button type="submit" className="button">
            Confirmer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddExemplaire;
