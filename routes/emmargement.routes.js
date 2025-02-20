const express = require("express");
const EmargementController = require("../controllers/emargement.Controller");
const authMiddleware = require("../middlewares/userMiddleware");
const authenticateAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

// ➜ Seuls les professeurs concernés et les admins peuvent émarger
router.post("/:seance_id", authMiddleware , EmargementController.ajouterEmargement);

router.get("/:seance_id", authMiddleware, EmargementController.getEmargementsBySeance);
router.get("/programmes/:programme_id/heures", authMiddleware, EmargementController.getTotalHeuresEffectuees);

module.exports = router;
