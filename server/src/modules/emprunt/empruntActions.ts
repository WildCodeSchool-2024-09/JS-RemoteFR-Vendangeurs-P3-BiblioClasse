import { format } from "date-fns";
import type { RequestHandler } from "express";
import exemplaireRepository from "../exemplaire/exemplaireRepository";
import empruntRepository from "./empruntRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const emprunts = await empruntRepository.readAll();
    res.json(emprunts);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const emprunt = await empruntRepository.read(Number(req.params.id_emprunt));
    if (emprunt == null) {
      res.sendStatus(404);
    } else {
      res.json(emprunt);
    }
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const updatedEmprunt = await empruntRepository.update(
      Number(req.params.id_emprunt),
      req.body,
    );
    res.json(updatedEmprunt);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { id_exemplaire, id_eleve, date_emprunt, date_retour } = req.body;

    console.info("Received request to create emprunt:", {
      id_exemplaire,
      id_eleve,
    });

    const exemplaire = await exemplaireRepository.read(id_exemplaire);
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
    };
    const insertId = await empruntRepository.create(newEmprunt);
    console.info("Emprunt created with ID:", insertId);

    await exemplaireRepository.update(id_exemplaire, {
      ISBN: exemplaire.ISBN,
      isAvailable: false,
    });
    console.info("Exemplaire updated to not available:", id_exemplaire);

    res.status(201).json({ id_emprunt: insertId, ...newEmprunt });
  } catch (err) {
    console.error("Error creating emprunt:", err);
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    await empruntRepository.delete(Number(req.params.id_emprunt));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const countLoansByStatus: RequestHandler = async (req, res, next) => {
  try {
    const counts = await empruntRepository.countLoansByStatus();
    res.json(counts);
  } catch (error) {
    console.error("Erreur lors de la récupération des emprunts:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des emprunts" });
  }
};

const LoansByStudent: RequestHandler = async (req, res, next) => {
  try {
    const { id_eleve } = req.params;
    const emprunts = await empruntRepository.getEmpruntsByEleve(
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
  add,
  edit,
  destroy,
  countLoansByStatus,
  LoansByStudent,
};
