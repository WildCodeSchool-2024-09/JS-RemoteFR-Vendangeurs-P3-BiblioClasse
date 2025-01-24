import { useState } from "react";

interface AddEmpruntProps {
  onEmpruntAdded: (emprunt: {
    date_emprunt: string;
    date_retour: string;
    date_retour_effectif: string;
    id_exemplaire: string;
    id_eleve: string;
  }) => void;
}

const AddEmprunt: React.FC<AddEmpruntProps> = ({ onEmpruntAdded }) => {
  const [date_emprunt, setDate_emprunt] = useState("");
  const [date_retour, setDate_retour] = useState("");
  const [date_retour_effectif, setDate_retour_effectif] = useState("");
  const [id_exemplaire, setId_exemplaire] = useState("");
  const [id_eleve, setId_eleve] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3310/api/emprunts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date_emprunt,
        date_retour,
        date_retour_effectif,
        id_exemplaire,
        id_eleve,
      }),
    });

    if (response.ok) {
      const newEmprunt = await response.json();
      onEmpruntAdded(newEmprunt);
    } else {
      console.error("Erreur lors de l'ajout de l'emprunt");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Date d'emprunt:
        <input
          type="date"
          value={date_emprunt}
          onChange={(e) => setDate_emprunt(e.target.value)}
          required
        />
      </label>
      <label>
        Date de retour:
        <input
          type="date"
          value={date_retour}
          onChange={(e) => setDate_retour(e.target.value)}
        />
      </label>
      <label>
        Date de retour effectif:
        <input
          type="date"
          value={date_retour_effectif}
          onChange={(e) => setDate_retour_effectif(e.target.value)}
        />
      </label>
      <label>
        ID de l'exemplaire:
        <input
          type="text"
          value={id_exemplaire}
          onChange={(e) => setId_exemplaire(e.target.value)}
          required
        />
      </label>
      <label>
        ID de l'élève:
        <input
          type="text"
          value={id_eleve}
          onChange={(e) => setId_eleve(e.target.value)}
          required
        />
      </label>
      <button type="submit">Ajouter l'emprunt</button>
    </form>
  );
};

export default AddEmprunt;
