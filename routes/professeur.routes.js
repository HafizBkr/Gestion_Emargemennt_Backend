const express = require('express');
const router = express.Router();
const professeurController = require('../controllers/professeur.Controller');
const authenticateAdmin = require('../middlewares/adminMiddleware');

router.post('/login', professeurController.loginProfesseur);
router.post('/professeurs', authenticateAdmin('admin'), professeurController.createProfesseur);
router.put('/professeurs/:id/change-password', professeurController.changePassword);
router.get('/professeurs', authenticateAdmin('admin'),professeurController.getAllProfesseurs);
router.get('/professeurs/:id', authenticateAdmin('admin'),professeurController.getProfesseurById);
router.put('/professeurs/:id', authenticateAdmin('admin'), professeurController.updateProfesseur);
router.delete('/professeurs/:id', authenticateAdmin('admin'), professeurController.deleteProfesseur);
router.patch('/professeurs/:id/activation', authenticateAdmin('admin'),professeurController.toggleActivationProfesseur);
router.post("/professeurs/:id/domaines", authenticateAdmin("admin"), professeurController.assignerDomaines);
router.get("/professeurs/:id/domaines", authenticateAdmin("admin"), professeurController.getDomainesProfesseur);
router.delete("/professeurs/:id/domaines/:domaine_id", authenticateAdmin("admin"), professeurController.supprimerDomaineProfesseur);
router.get('/professeurs/domaine/:domaine_id', authenticateAdmin('admin'), professeurController.getProfesseursByDomaine);
module.exports = router;