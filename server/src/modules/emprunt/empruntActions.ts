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
    const { id_exemplaire, id_eleve } = req.body;
    const date_emprunt = format(new Date(), "yyyy-MM-dd HH:mm:ss");
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
      date_emprunt,
      date_retour: null,
      date_retour_effectif: null,
      id_eleve,
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

const countLoansInProgress: RequestHandler = async (req, res, next) => {
  try {
    const count = await empruntRepository.countLoansInProgress();
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, edit, destroy, countLoansInProgress };
