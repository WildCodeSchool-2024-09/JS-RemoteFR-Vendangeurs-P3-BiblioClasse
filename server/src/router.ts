import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import livreActions from "./modules/livre/livreActions";
router.get("/api/livres", livreActions.browse);
router.get("/api/livres/:ISBN", livreActions.read);
router.post("/api/livres", livreActions.add);
router.put("/api/livres/:ISBN", livreActions.edit);
router.delete("/api/livres/:ISBN", livreActions.destroy);
router.get("/api/livres/search", livreActions.search);

import eleveActions from "./modules/eleve/eleveActions";
router.get("/api/eleves", eleveActions.browse);
router.get("/api/eleves/:ISBN", eleveActions.read);
router.post("/api/eleves", eleveActions.add);
router.put("/api/eleves/:ISBN", eleveActions.edit);
router.delete("/api/eleves/:ISBN", eleveActions.destroy);
router.get("/api/eleves/search", eleveActions.search);

import exemplaireActions from "./modules/exemplaire/exemplaireActions";
router.get("/api/exemplaires", exemplaireActions.browse);
router.get("/api/exemplaires/:id_exemplaire", exemplaireActions.read);
router.post("/api/exemplaires", exemplaireActions.add);
router.put("/api/exemplaires/:id_exemplaire", exemplaireActions.edit);
router.delete("/api/exemplaires/:id_exemplaire", exemplaireActions.destroy);

import empruntActions from "./modules/emprunt/empruntActions";
router.get("/api/emprunts", empruntActions.browse);
router.get("/api/emprunts/:id_emprunt", empruntActions.read);
router.post("/api/emprunts", empruntActions.add);
router.put("/api/emprunts/:id_emprunt", empruntActions.edit);
router.delete("/api/emprunts/:id_emprunt", empruntActions.destroy);
/* ************************************************************************* */

export default router;
