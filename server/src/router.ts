import express from "express";

const router = express.Router();

import livreActions from "./modules/livre/livreActions";
router.get("/api/livres", livreActions.browse);
router.get("/api/livres_with_exemplaires", livreActions.browseWithExemplaires);
router.get("/api/livres/:ISBN", livreActions.read);
router.post("/api/livres", livreActions.add);
router.put("/api/livres/:ISBN", livreActions.edit);
router.delete("/api/livres/:ISBN", livreActions.destroy);
router.get("/api/livres/search", livreActions.search);
router.get("/api/top_books", livreActions.getTopBooks);

import eleveActions from "./modules/eleve/eleveActions";
router.get("/api/eleves", eleveActions.browse);
router.get("/api/eleves/:id_eleve", eleveActions.read);
router.get(
  "/api/eleves_with_borrows",
  eleveActions.browseStudentsWithBorrowsInProgress,
);
router.get(
  "/api/eleves_with_borrows_information",
  eleveActions.browseStudentsWithBorrowsInformation,
);
router.post("/api/eleves", eleveActions.add);
router.put("/api/eleves/:id_eleve", eleveActions.edit);
router.delete("/api/eleves/:id_eleve", eleveActions.destroy);
router.get("/api/eleves/search", eleveActions.search);

import exemplaireActions from "./modules/exemplaire/exemplaireActions";
router.get("/api/exemplaires", exemplaireActions.browse);
router.get("/api/exemplaires/:id_exemplaire", exemplaireActions.read);
router.post("/api/exemplaires", exemplaireActions.add);
router.put("/api/exemplaires/:id_exemplaire", exemplaireActions.edit);
router.delete("/api/exemplaires/:id_exemplaire", exemplaireActions.destroy);
router.get(
  "/api/exemplaires_available",
  exemplaireActions.readAvailableExemplaire,
);
router.get(
  "/api/exemplaires_borrowed/:ISBN",
  exemplaireActions.readBorrowedExemplaireByISBN,
);

import empruntActions from "./modules/emprunt/empruntActions";
router.get("/api/emprunts", empruntActions.browse);
router.get("/api/emprunts/:id_emprunt", empruntActions.read);
router.post("/api/emprunts", empruntActions.add);
router.put("/api/emprunts/:id_emprunt", empruntActions.edit);
router.delete("/api/emprunts/:id_emprunt", empruntActions.destroy);
router.get(
  "/api/students-with-loans-in-progress",
  empruntActions.countStudentsWithLoansInProgress,
);
router.get(
  "/api/students-with-loans-due-in-7-days",
  empruntActions.countStudentsWithLoansDueSoon,
);
router.get(
  "/api/students-with-overdue-loans",
  empruntActions.countStudentsWithOverdueLoans,
);
router.get("/api/emprunts_in-progress", empruntActions.LoansInProgress);
router.get("/api/emprunts_by_student/:id_eleve", empruntActions.LoansByStudent);

import retour from "./modules/retour/retourActions";
router.post("/api/emprunts/retours", retour.returnBook);

import parametreActions from "./modules/parametre/parametreActions";
router.get("/api/parametres/loanDuration", parametreActions.readLoanDuration);
router.put("/api/parametres/loanDuration", parametreActions.editLoanDuration);
router.get("/api/parametres/borrowLimit", parametreActions.readBorrowLimit);
router.put("/api/parametres/borrowLimit", parametreActions.editBorrowLimit);
/* ************************************************************************* */

export default router;
