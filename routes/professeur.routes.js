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


module.exports = router;