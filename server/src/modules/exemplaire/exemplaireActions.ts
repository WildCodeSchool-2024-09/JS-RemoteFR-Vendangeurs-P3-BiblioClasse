import type { RequestHandler } from "express";
import type { CustomRequest } from "../../types/express/CustomRequest";
import exemplaireRepository from "./exemplaireRepository";

const browse: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const { ISBN } = req.query;
    let exemplaires: Array<{
      id_exemplaire?: number;
      ISBN: string;
      isAvailable: boolean;
    }>;
    if (ISBN) {
      exemplaires = await exemplaireRepository.readAllByISBN(
        userId,
        ISBN as string,
      );
    } else {
      exemplaires = await exemplaireRepository.readAll(userId);
    }
    res.json(exemplaires);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const exemplaire = await exemplaireRepository.read(
      userId,
      Number(req.params.id_exemplaire),
    );
    if (exemplaire == null) {
      res.sendStatus(404);
    } else {
      res.json(exemplaire);
    }
  } catch (err) {
    next(err);
  }
};

const readBorrowedExemplaireByISBN: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const { ISBN } = req.params;
    let borrowedExemplaireByISBN: Array<{
      nom: string;
      prenom: string;
      date_retour: string;
      id_exemplaire: number;
      id_eleve: number;
    }>;
    borrowedExemplaireByISBN =
      await exemplaireRepository.readBorrowedExemplaireByISBN(
        userId,
        ISBN as string,
      );
    if (borrowedExemplaireByISBN == null) {
      res.sendStatus(404);
    } else {
      res.json(borrowedExemplaireByISBN);
    }
  } catch (err) {
    next(err);
  }
};

const readAvailableExemplaire: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const exemplaire =
      await exemplaireRepository.readAvailableExemplaire(userId);
    if (exemplaire == null) {
      res.sendStatus(404);
    } else {
      res.json(exemplaire);
    }
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const newExemplaire = {
      ISBN: req.body.ISBN,
      isAvailable: req.body.isAvailable ?? true,
    };
    const insertId = await exemplaireRepository.create(userId, newExemplaire);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const updatedExemplaire = await exemplaireRepository.update(
      req.body,
      userId,
      Number(req.params.id_exemplaire),
    );
    res.json(updatedExemplaire);
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    await exemplaireRepository.delete(userId, Number(req.params.id_exemplaire));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  read,
  readBorrowedExemplaireByISBN,
  add,
  edit,
  destroy,
  readAvailableExemplaire,
};
