import type { RequestHandler } from "express";
import type { CustomRequest } from "../../types/express/CustomRequest";
import empruntRepository from "../emprunt/empruntRepository";
import exemplaireRepository from "../exemplaire/exemplaireRepository";

const returnBook: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const { id_exemplaire, id_eleve, date_retour_effectif } = req.body;

    if (!id_exemplaire || !id_eleve || !date_retour_effectif) {
      res.status(400).json({ message: "Données manquantes ou invalides" });
      return;
    }

    await empruntRepository.updateReturnDate(
      date_retour_effectif,
      userId,
      id_exemplaire,
      id_eleve,
    );

    await exemplaireRepository.updateAvailability(userId, id_exemplaire);

    res.status(200).send("Retour confirmé");
  } catch (error) {
    console.error("Erreur lors de la confirmation du retour:", error);
  }
  next();
};

export default {
  returnBook,
};
