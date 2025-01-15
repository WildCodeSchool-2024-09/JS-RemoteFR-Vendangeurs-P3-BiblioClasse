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

/* ************************************************************************* */

export default router;
