import type { RequestHandler } from "express";
import type { CustomRequest } from "../../types/express/CustomRequest";
import eleveRepository from "./eleveRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    // Fetch all items
    const eleves = await eleveRepository.readAll(userId);

    // Respond with the items in JSON format
    res.json(eleves);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const browseStudentsWithBorrowsInProgress: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const eleves =
      await eleveRepository.readAllStudentsWithBorrowsInProgress(userId);
    res.json(eleves);
  } catch (err) {
    next(err);
  }
};

const browseStudentsWithBorrowsInformation: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const eleves =
      await eleveRepository.readAllStudentsWithBorrowsInformation(userId);
    res.json(eleves);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    // Fetch a specific item based on the provided ID
    const eleve = await eleveRepository.read(userId, req.params.id_eleve);

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
const add: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const { nom, prenom } = req.body;
    console.info("Requête reçue:", req.body);

    if (!nom || !prenom || !userId) {
      res.status(400).json({ message: "Missing required fields" });
    }

    // Create the item
    const newEleve = { nom, prenom };
    const insertId = await eleveRepository.create(
      userId,
      newEleve.nom,
      newEleve.prenom,
    );

    // Respond with HTTP 201 (Created) and the ID of the newly inserted item
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit operation
const edit: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const updatedEleve = await eleveRepository.update(
      userId,
      req.params.id_eleve,
      req.body,
    );
    res.json(updatedEleve);
  } catch (err) {
    next(err);
  }
};

// The D of BREAD - Delete operation
const destroy: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    await eleveRepository.delete(userId, req.params.id_eleve);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

//The S of breadS - Search operation
const search: RequestHandler = async (req: CustomRequest, res, next) => {
  const userId = Number(req.params.user_id);
  try {
    const searchTerm = req.query.q as string;
    const eleves = await eleveRepository.search(userId, searchTerm);
    res.status(200).json(eleves);
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  browseStudentsWithBorrowsInProgress,
  browseStudentsWithBorrowsInformation,
  read,
  add,
  edit,
  destroy,
  search,
};
