const express = require('express');
const router = express.Router();
const NiveauController = require('../controllers/niveau.Controller');
const authenticateAdmin = require('../middlewares/adminMiddleware');

// Routes pour les niveaux
router.post('/', authenticateAdmin('admin'), NiveauController.createNiveau);
router.get('/grouped-by-filiere', NiveauController.getAllNiveauxGroupedByFiliere); // Nouvelle route
router.get('/filiere/:filiere_id', authenticateAdmin('admin'), NiveauController.getAllNiveauxByFiliere);
router.get('/:id', authenticateAdmin('admin'), NiveauController.getNiveauById);
router.put('/:id', authenticateAdmin('admin'), NiveauController.updateNiveau);
router.delete('/:id', authenticateAdmin('admin'), NiveauController.deleteNiveau);

module.exports = router;
