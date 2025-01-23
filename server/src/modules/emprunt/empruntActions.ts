import type { RequestHandler } from "express";
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

const add: RequestHandler = async (req, res, next) => {
  try {
    const newEmprunt = {
      date_emprunt: req.body.date_emprunt,
      date_retour: req.body.date_retour,
      date_retour_effectif: req.body.date_retour_effectif,
      id_exemplaire: req.body.id_exemplaire,
      id_eleve: req.body.id_eleve,
    };
    const insertId = await empruntRepository.create(newEmprunt);
    res.status(201).json({ insertId });
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

const destroy: RequestHandler = async (req, res, next) => {
  try {
    await empruntRepository.delete(Number(req.params.id_emprunt));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, edit, destroy };
