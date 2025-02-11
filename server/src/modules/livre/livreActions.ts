import type { RequestHandler } from "express";
import type { CustomRequest } from "../../types/express/CustomRequest";

import exemplaireRepository from "../exemplaire/exemplaireRepository";
import livreRepository from "./livreRepository";

const browse: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const livres = await livreRepository.readAll(userId);
    res.json(livres);
  } catch (err) {
    next(err);
  }
};

const browseWithExemplaires: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const livres = await livreRepository.readAllWithExemplaires(userId);
    res.json(livres);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const livre = await livreRepository.read(userId, req.params.ISBN13);
    if (livre == null) {
      res.sendStatus(404);
    } else {
      res.json(livre);
    }
  } catch (err) {
    next(err);
  }
};

const getTopBooks: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const topBorrowedBooks = await livreRepository.getTopBooks(userId);
    res.json(topBorrowedBooks);
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const updatedLivre = await livreRepository.update(
      userId,
      req.params.ISBN13,
      req.body,
    );
    res.json(updatedLivre);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const { ISBN13, ISBN10, titre, auteur, couverture_img, livre_resume } =
      req.body;

    const newLivre = {
      ISBN13,
      ISBN10,
      titre,
      auteur,
      couverture_img,
      livre_resume,
    };
    const livreId = await livreRepository.create(userId, newLivre);

    const newExemplaire = { ISBN13, isAvailable: true };
    const exemplaireId = await exemplaireRepository.create(
      userId,
      newExemplaire,
    );

    res.status(201).json({
      livreId,
      exemplaireId,
      message: "Livre et exemplaire ajoutés avec succès",
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout du livre:", err);
    next(err);
  }
};

const destroy: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    await livreRepository.delete(userId, req.params.ISBN13);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const search: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const searchTerm = req.query.q as string;
    const livres = await livreRepository.search(userId, searchTerm);
    res.status(200).json(livres);
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  browseWithExemplaires,
  read,
  add,
  edit,
  destroy,
  search,
  getTopBooks,
};
