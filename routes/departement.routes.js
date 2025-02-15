const express = require("express");
const router = express.Router();
const departementController = require("../controllers/departement.Controller");
const authenticateAdmin = require('../middlewares/adminMiddleware');

router.post("/", authenticateAdmin('admin'), departementController.createDepartement);
router.get("/", authenticateAdmin('admin'), departementController.getAllDepartements);
router.get("/:id", authenticateAdmin('admin'), departementController.getDepartementById);
router.put("/:id", authenticateAdmin('admin'), departementController.updateDepartement);
router.delete("/:id", authenticateAdmin('admin'), departementController.deleteDepartement);
router.patch("/:id/toggle", authenticateAdmin('admin'), departementController.toggleDepartement);

module.exports = router;
