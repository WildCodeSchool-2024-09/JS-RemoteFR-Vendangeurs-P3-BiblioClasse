import type { RequestHandler } from "express";
import empruntRepository from "../emprunt/empruntRepository";
import exemplaireRepository from "../exemplaire/exemplaireRepository";

const returnBook: RequestHandler = async (req, res, next) => {
  try {
    console.info("Données reçues pour retour:", req.body);

    const { id_exemplaire, id_eleve, date_retour_effectif } = req.body;

    if (!id_exemplaire || !id_eleve || !date_retour_effectif) {
      res.status(400).json({ message: "Données manquantes ou invalides" });
      return;
    }

    await empruntRepository.updateReturnDate(
      id_exemplaire,
      id_eleve,
      date_retour_effectif,
    );

    await exemplaireRepository.updateAvailability(id_exemplaire);

    res.status(200).send("Retour confirmé");
  } catch (error) {
    console.error("Erreur lors de la confirmation du retour:", error);
  }
  next();
};

export default {
  returnBook,
};
