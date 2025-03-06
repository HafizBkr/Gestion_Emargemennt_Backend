const express = require("express");
const EmargementController = require("../controllers/emargement.Controller");
const authMiddleware = require("../middlewares/userMiddleware");
const authenticateAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

// Emmargement Debut 
router.post("/Debut/:seance_id", authMiddleware , EmargementController.ajouterEmargementDebut);
// Emmargement de fin
router.post("/Fin/:seance_id", authMiddleware , EmargementController.ajouterEmargementFin);

router.get("/:seance_id", authMiddleware, EmargementController.getEmargementsBySeance);
router.get("/programmes/:programme_id/heures", authMiddleware, EmargementController.getTotalHeuresEffectuees);

module.exports = router;
