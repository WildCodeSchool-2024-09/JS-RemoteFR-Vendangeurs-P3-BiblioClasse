import "../styles/Mon_livre.css";
import Cookies from "js-cookie";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Exemplaire {
  id_exemplaire: number;
  id_eleve: number;
  nom: string;
  prenom: string;
  date_retour: string;
}

interface AddExemplaireProps {
  onExemplaireAdded: (exemplaire: Exemplaire) => void;
  handleModalClose: () => void;
  ISBN13: string;
}

function AddExemplaire({
  ISBN13,
  onExemplaireAdded,
  handleModalClose,
}: AddExemplaireProps) {
  const { userId, setUserId } = useAuth();
  const isAvailable = true;
  const [quantity, setQuantity] = useState(1);

  /*Ajout d'un exemplaire*/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      return setUserId(Number(Cookies.get("user_id")));
    }
    for (let i = 0; i < quantity; i++) {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/${userId}/exemplaires`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ISBN13, isAvailable }),
        },
      );

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

  /*Gestion de la quantité d'exemplaires à ajouter*/
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
