import type { RequestHandler } from "express";

import parametreRepository from "./parametreRepository";

const readLoanDuration: RequestHandler = async (req, res, next) => {
  try {
    const parametre = await parametreRepository.getLoanDuration();
    res.json(parametre);
  } catch (err) {
    next(err);
  }
};

const editLoanDuration: RequestHandler = async (req, res, next) => {
  try {
    await parametreRepository.setLoanDuration(req.body.loanDuration);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const readBorrowLimit: RequestHandler = async (req, res, next) => {
  try {
    const parametre = await parametreRepository.getBorrowLimit();
    res.json(parametre);
  } catch (err) {
    next(err);
  }
};

const editBorrowLimit: RequestHandler = async (req, res, next) => {
  try {
    await parametreRepository.setBorrowLimit(req.body.borrowLimit);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export default {
  readLoanDuration,
  editLoanDuration,
  readBorrowLimit,
  editBorrowLimit,
};
