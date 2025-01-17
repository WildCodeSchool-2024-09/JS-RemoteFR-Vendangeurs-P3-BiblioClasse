import type { RequestHandler } from "express";

import eleveRepository from "./eleveRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all items
    const eleves = await eleveRepository.readAll();

    // Respond with the items in JSON format
    res.json(eleves);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const eleve = await eleveRepository.read(req.params.id_eleve);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (eleve == null) {
      res.sendStatus(404);
    } else {
      res.json(eleve);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extract the item data from the request body
    console.info("Requête reçue:", req.body);

    const newEleve = {
      nom: req.body.nom,
      prenom: req.body.prenom,
    };

    // Create the item
    const insertId = await eleveRepository.create(newEleve);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted item
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit operation
const edit: RequestHandler = async (req, res, next) => {
  try {
    const updatedEleve = await eleveRepository.update(
      req.params.id_eleve,
      req.body,
    );
    res.json(updatedEleve);
  } catch (err) {
    next(err);
  }
};

// The D of BREAD - Delete operation
const destroy: RequestHandler = async (req, res, next) => {
  try {
    await eleveRepository.delete(req.params.id_eleve);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

//The S of breadS - Search operation
const search: RequestHandler = async (req, res, next) => {
  try {
    const searchTerm = req.query.q as string;
    const eleves = await eleveRepository.search(searchTerm);
    res.status(200).json(eleves);
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, edit, destroy, search };
