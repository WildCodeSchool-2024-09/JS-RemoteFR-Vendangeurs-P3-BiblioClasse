import type { RequestHandler } from "express";
import type { CustomRequest } from "../../types/express/CustomRequest";
import exemplaireRepository from "./exemplaireRepository";

const browse: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const { ISBN13 } = req.query;
    let exemplaires: Array<{
      id_exemplaire?: number;
      ISBN13: string;
      isAvailable: boolean;
    }>;
    if (ISBN13) {
      exemplaires = await exemplaireRepository.readAllByISBN13(
        userId,
        ISBN13 as string,
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

const readBorrowedExemplaireByISBN13: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const { ISBN13 } = req.params;
    let borrowedExemplaireByISBN13: Array<{
      nom: string;
      prenom: string;
      date_retour: string;
      id_exemplaire: number;
      id_eleve: number;
    }>;
    borrowedExemplaireByISBN13 =
      await exemplaireRepository.readBorrowedExemplaireByISBN13(
        userId,
        ISBN13 as string,
      );
    if (borrowedExemplaireByISBN13 == null) {
      res.sendStatus(404);
    } else {
      res.json(borrowedExemplaireByISBN13);
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
      ISBN13: req.body.ISBN13,
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
  readBorrowedExemplaireByISBN13,
  add,
  edit,
  destroy,
  readAvailableExemplaire,
};
