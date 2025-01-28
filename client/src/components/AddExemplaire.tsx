import "../styles/Mon_livre.css";
import { useState } from "react";

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
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (let i = 0; i < quantity; i++) {
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
    }
    handleModalClose();
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
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
        <h2 className="h2modal">Ajouter un exemplaire ou plus ?</h2>
        <form onSubmit={handleSubmit} className="form-exemplaire">
          <div className="quantity-control">
            <button
              type="button"
              className="quantity-setter-button"
              onClick={handleDecrement}
            >
              -
            </button>
            <span className="span-quantity">{quantity}</span>
            <button
              type="button"
              className="quantity-setter-button"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
          <button type="submit" className="button-add-exemplaire">
            Confirmer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddExemplaire;
