import type { RequestHandler } from "express";
import type { CustomRequest } from "../../types/express/CustomRequest";
import exemplaireRepository from "../exemplaire/exemplaireRepository";
import empruntRepository from "./empruntRepository";

const browse: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const emprunts = await empruntRepository.readAll(userId);
    res.json(emprunts);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const emprunt = await empruntRepository.read(
      userId,
      Number(req.params.id_emprunt),
    );
    if (emprunt == null) {
      res.sendStatus(404);
    } else {
      res.json(emprunt);
    }
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const updatedEmprunt = await empruntRepository.update(
      userId,
      Number(req.params.id_emprunt),
      req.body,
    );
    res.json(updatedEmprunt);
  } catch (err) {
    next(err);
  }
};

const addBookBorrow: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
): Promise<void> => {
  const userId = Number(req.params.user_id);
  try {
    const { id_exemplaire, id_eleve, date_emprunt, date_retour } = req.body;
    const exemplaire = await exemplaireRepository.read(userId, id_exemplaire);
    if (!exemplaire.isAvailable) {
      res.status(400).json({ error: "Exemplaire non disponible" });
      return;
    }

    const newEmprunt = {
      id_exemplaire,
      id_eleve,
      date_emprunt,
      date_retour,
      date_retour_effectif: null,
      userId,
    };
    const insertId = await empruntRepository.create(userId, newEmprunt);

    await exemplaireRepository.update(
      {
        ISBN13: exemplaire.ISBN13,
        isAvailable: false,
      },
      userId,
      id_exemplaire,
    );

    res.status(201).json({ id_emprunt: insertId, ...newEmprunt });
  } catch (err) {
    console.error("Error creating emprunt:", err);
    next(err);
  }
};

const destroy: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    await empruntRepository.delete(Number(req.params.id_emprunt), userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const countStudentsWithLoansInProgress: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const counts =
      await empruntRepository.countStudentsWithLoansInProgress(userId);
    res.json(counts);
  } catch (error) {
    console.error("Erreur lors de la récupération des emprunts:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des emprunts" });
  }
};
const countStudentsWithLoansDueSoon: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const counts =
      await empruntRepository.countStudentsWithLoansDueSoon(userId);
    res.json(counts);
  } catch (error) {
    console.error("Erreur lors de la récupération des emprunts:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des emprunts" });
  }
};
const countStudentsWithOverdueLoans: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const counts =
      await empruntRepository.countStudentsWithOverdueLoans(userId);
    res.json(counts);
  } catch (error) {
    console.error("Erreur lors de la récupération des emprunts:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des emprunts" });
  }
};

const LoansInProgress: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const counts = await empruntRepository.LoansInProgress(userId);
    res.json(counts);
  } catch (error) {
    console.error("Erreur lors de la récupération des emprunts:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des emprunts" });
  }
};

const LoansByStudent: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const { id_eleve } = req.params;
    const emprunts = await empruntRepository.getEmpruntsByEleve(
      userId,
      Number(id_eleve),
    );
    res.json(emprunts);
  } catch (error) {
    console.error("Erreur lors de la récupération des emprunts:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des emprunts" });
  }
};

export default {
  browse,
  read,
  addBookBorrow,
  edit,
  destroy,
  countStudentsWithLoansInProgress,
  countStudentsWithLoansDueSoon,
  countStudentsWithOverdueLoans,
  LoansInProgress,
  LoansByStudent,
};
