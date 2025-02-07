import express from "express";

const router = express.Router();

import livreActions from "./modules/livre/livreActions";
router.get("/api/:user_id/livres", livreActions.browse);
router.get(
  "/api/:user_id/livres_with_exemplaires",
  livreActions.browseWithExemplaires,
);
router.get("/api/:user_id/livres/:ISBN", livreActions.read);
router.post("/api/:user_id/livres", livreActions.add);
router.put("/api/:user_id/livres/:ISBN", livreActions.edit);
router.delete("/api/:user_id/livres/:ISBN", livreActions.destroy);
router.get("/api/:user_id/livres/search", livreActions.search);
router.get("/api/:user_id/top_books", livreActions.getTopBooks);

import eleveActions from "./modules/eleve/eleveActions";
router.get("/api/:user_id/eleves", eleveActions.browse);
router.get("/api/:user_id/eleves/:id_eleve", eleveActions.read);
router.get(
  "/api/:user_id/eleves_with_borrows",
  eleveActions.browseStudentsWithBorrowsInProgress,
);
router.get(
  "/api/:user_id/eleves_with_borrows_information",
  eleveActions.browseStudentsWithBorrowsInformation,
);
router.post("/api/:user_id/eleves", eleveActions.add);
router.put("/api/:user_id/eleves/:id_eleve", eleveActions.edit);
router.delete("/api/:user_id/eleves/:id_eleve", eleveActions.destroy);
router.get("/api/:user_id/eleves/search", eleveActions.search);

import exemplaireActions from "./modules/exemplaire/exemplaireActions";
router.get("/api/:user_id/exemplaires", exemplaireActions.browse);
router.get("/api/:user_id/exemplaires/:id_exemplaire", exemplaireActions.read);
router.post("/api/:user_id/exemplaires", exemplaireActions.add);
router.put("/api/:user_id/exemplaires/:id_exemplaire", exemplaireActions.edit);
router.delete(
  "/api/:user_id/exemplaires/:id_exemplaire",
  exemplaireActions.destroy,
);
router.get(
  "/api/:user_id/exemplaires_available",
  exemplaireActions.readAvailableExemplaire,
);
router.get(
  "/api/:user_id/exemplaires_borrowed/:ISBN",
  exemplaireActions.readBorrowedExemplaireByISBN,
);

import empruntActions from "./modules/emprunt/empruntActions";
router.get("/api/:user_id/emprunts", empruntActions.browse);
router.get("/api/:user_id/emprunts/:id_emprunt", empruntActions.read);
router.post("/api/:user_id/emprunts", empruntActions.addBookBorrow);
router.put("/api/:user_id/emprunts/:id_emprunt", empruntActions.edit);
router.delete("/api/:user_id/emprunts/:id_emprunt", empruntActions.destroy);
router.get(
  "/api/:user_id/students-with-loans-in-progress",
  empruntActions.countStudentsWithLoansInProgress,
);
router.get(
  "/api/:user_id/students-with-loans-due-in-7-days",
  empruntActions.countStudentsWithLoansDueSoon,
);
router.get(
  "/api/:user_id/students-with-overdue-loans",
  empruntActions.countStudentsWithOverdueLoans,
);
router.get(
  "/api/:user_id/emprunts_in-progress",
  empruntActions.LoansInProgress,
);
router.get(
  "/api/:user_id/emprunts_by_student/:id_eleve",
  empruntActions.LoansByStudent,
);

import retour from "./modules/retour/retourActions";
router.post("/api/:user_id/retours", retour.returnBook);

import parametreActions from "./modules/parametre/parametreActions";
router.get(
  "/api/:user_id/parametres/loanDuration",
  parametreActions.readLoanDuration,
);
router.put(
  "/api/:user_id/parametres/loanDuration",
  parametreActions.editLoanDuration,
);
router.get(
  "/api/:user_id/parametres/borrowLimit",
  parametreActions.readBorrowLimit,
);
router.put(
  "/api/:user_id/parametres/borrowLimit",
  parametreActions.editBorrowLimit,
);

import authActions from "./modules/auth/authActions";
router.post("/api/auth/login", authActions.login);
router.post("/api/auth/register", authActions.register);
// router.post("/api/auth/logout", authActions.logout);
// router.get("/api/auth/user", authActions.getUser);

/* ************************************************************************* */

export default router;
