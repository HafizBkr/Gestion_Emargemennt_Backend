const express = require("express");
const router = express.Router();
const domaineController = require("../controllers/domain.Controller");
const authenticateAdmin = require("../middlewares/adminMiddleware");

router.post("/domaines", authenticateAdmin("admin"), domaineController.creerDomaine);
router.get("/domaines", domaineController.getAllDomaines);
router.get("/domaines/:id", domaineController.getDomaineById);
router.put("/domaines/:id", authenticateAdmin("admin"), domaineController.updateDomaine);
router.delete("/domaines/:id", authenticateAdmin("admin"), domaineController.deleteDomaine);

module.exports = router;
