import type { RequestHandler } from "express";

import exemplaireRepository from "../exemplaire/exemplaireRepository";
import livreRepository from "./livreRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const livres = await livreRepository.readAll();
    res.json(livres);
  } catch (err) {
    next(err);
  }
};

const browseWithExemplaires: RequestHandler = async (req, res, next) => {
  try {
    const livres = await livreRepository.readAllWithExemplaires();
    res.json(livres);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const livre = await livreRepository.read(req.params.ISBN);
    if (livre == null) {
      res.sendStatus(404);
    } else {
      res.json(livre);
    }
  } catch (err) {
    next(err);
  }
};

const getTopBooks: RequestHandler = async (req, res, next) => {
  try {
    const topBorrowedBooks = await livreRepository.getTopBooks();
    res.json(topBorrowedBooks);
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const updatedLivre = await livreRepository.update(
      req.params.ISBN,
      req.body,
    );
    res.json(updatedLivre);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const { ISBN, titre, auteur, couverture_img, livre_resume } = req.body;
    const newLivre = { ISBN, titre, auteur, couverture_img, livre_resume };
    await livreRepository.create(newLivre);
    const newExemplaire = { ISBN, isAvailable: true };
    await exemplaireRepository.create(newExemplaire);
    res
      .status(201)
      .json({ message: "Livre et exemplaire ajoutés avec succès" });
  } catch (err) {
    console.error("Erreur lors de l'ajout du livre:", err);
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    await livreRepository.delete(req.params.ISBN);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const search: RequestHandler = async (req, res, next) => {
  try {
    const searchTerm = req.query.q as string;
    const livres = await livreRepository.search(searchTerm);
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
