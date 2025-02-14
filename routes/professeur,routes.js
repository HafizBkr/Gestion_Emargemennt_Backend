const express = require('express');
const router = express.Router();
const professeurController = require('../controllers/professeur.Controller');
const authenticateAdmin = require('../middlewares/adminMiddleware');

router.post('/login', professeurController.loginProfesseur);
router.post('/professeurs', authenticateAdmin('admin'), professeurController.createProfesseur);
router.put('/professeurs/:id/change-password', professeurController.changePassword);
router.get('/professeurs', authenticateAdmin('admin'),professeurController.getAllProfesseurs);
router.get('/professeurs/:id', authenticateAdmin('admin'),professeurController.getProfesseurById);




// Routes protégées pour gérer les professeurs
router.get('/professeurs', authenticateAdmin, (req, res) => {
    professeurController.getAllProfesseurs(req, res);
});

router.get('/professeurs/:id', authenticateAdmin, (req, res) => {
    professeurController.getProfesseurById(req, res);
});



router.put('/professeurs/:id', authenticateAdmin, (req, res) => {
    professeurController.updateProfesseur(req, res);
});

router.delete('/professeurs/:id', authenticateAdmin, (req, res) => {
    professeurController.deleteProfesseur(req, res);
});

module.exports = router;