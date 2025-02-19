import type { RequestHandler } from "express";
import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../types/express/CustomRequest";
import parametreRepository from "./../repositories/parametreRepository";

const readLoanDuration: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const parametre = await parametreRepository.getLoanDuration(userId);
    if (!parametre) {
      res.status(404).json({ message: "Loan duration not found" });
    }
    res.json({ loanDuration: parametre });
  } catch (err) {
    next(err);
  }
};

const editLoanDuration: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  const { loanDuration } = req.body;

  try {
    await parametreRepository.changeLoanDuration(userId, loanDuration);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const readBorrowLimit: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  try {
    const parametre = await parametreRepository.getBorrowLimit(userId);
    if (!parametre) {
      res.status(404).json({ message: "Borrow limit not found" });
    }
    res.json({ borrowLimit: parametre });
  } catch (err) {
    next(err);
  }
};

const editBorrowLimit: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const userId = Number(req.params.user_id);
  const { borrowLimit } = req.body;
  try {
    await parametreRepository.changeBorrowLimit(userId, req.body.borrowLimit);
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
