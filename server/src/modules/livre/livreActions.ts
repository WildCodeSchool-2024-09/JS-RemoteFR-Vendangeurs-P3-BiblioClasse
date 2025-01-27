import type { RequestHandler } from "express";

import exemplaireRepository from "../exemplaire/exemplaireRepository";
import livreRepository from "./livreRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all items
    const livres = await livreRepository.readAll();

    // Respond with the items in JSON format
    res.json(livres);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const livre = await livreRepository.read(req.params.ISBN);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (livre == null) {
      res.sendStatus(404);
    } else {
      res.json(livre);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
// const add: RequestHandler = async (req, res, next) => {
//   try {
//     // Extract the item data from the request body
//     const newLivre = {
//       ISBN: req.body.ISBN,
//       titre: req.body.titre,
//       auteur: req.body.auteur,
//       couverture_img: req.body.couverture_img,
//       livre_resume: req.body.livre_resume,
//     };

//     // Create the item
//     const insertId = await livreRepository.create(newLivre);

//     const newExemplaire = { ISBN: newLivre.ISBN, isAvailable: true };
//     await exemplaireRepository.create(newExemplaire);

//     // Respond with HTTP 201 (Created) and the ID of the newly inserted item
//     res.status(201).json({ insertId });
//   } catch (err) {
//     // Pass any errors to the error-handling middleware
//     next(err);
//   }
// };

const add: RequestHandler = async (req, res, next) => {
  try {
    const { ISBN, titre, auteur, couverture_img, livre_resume } = req.body;
    const newLivre = { ISBN, titre, auteur, couverture_img, livre_resume };
    await livreRepository.create(newLivre);

    // Ajouter un exemplaire pour ce livre
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

// The E of BREAD - Edit operation
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

// The D of BREAD - Delete operation
const destroy: RequestHandler = async (req, res, next) => {
  try {
    await livreRepository.delete(req.params.ISBN);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

//The S of breadS - Search operation
const search: RequestHandler = async (req, res, next) => {
  try {
    const searchTerm = req.query.q as string;
    const livres = await livreRepository.search(searchTerm);
    res.status(200).json(livres);
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, edit, destroy, search };
