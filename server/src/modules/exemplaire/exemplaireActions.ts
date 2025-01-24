import type { RequestHandler } from "express";
import exemplaireRepository from "./exemplaireRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const { ISBN } = req.query;
    let exemplaires: Array<{ ISBN: string; isAvailable: boolean }>;
    if (ISBN) {
      exemplaires = await exemplaireRepository.readAllByISBN(ISBN as string);
    } else {
      exemplaires = await exemplaireRepository.readAll();
    }
    res.json(exemplaires);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const exemplaire = await exemplaireRepository.read(
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

const add: RequestHandler = async (req, res, next) => {
  try {
    const newExemplaire = {
      ISBN: req.body.ISBN,
      isAvailable: req.body.isAvailable ?? true,
    };
    const insertId = await exemplaireRepository.create(newExemplaire);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const updatedExemplaire = await exemplaireRepository.update(
      Number(req.params.id_exemplaire),
      req.body,
    );
    res.json(updatedExemplaire);
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    await exemplaireRepository.delete(Number(req.params.id_exemplaire));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, edit, destroy };
