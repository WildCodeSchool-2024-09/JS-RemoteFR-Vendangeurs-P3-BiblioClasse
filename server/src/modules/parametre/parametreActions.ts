import type { RequestHandler } from "express";

import parametreRepository from "./parametreRepository";

const read: RequestHandler = async (req, res, next) => {
  try {
    const parametre = await parametreRepository.getLoanDuration();
    res.json(parametre);
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    await parametreRepository.setLoanDuration(req.body.loanDuration);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export default { read, edit };
