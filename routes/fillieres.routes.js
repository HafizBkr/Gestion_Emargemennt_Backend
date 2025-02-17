const express = require('express');
const router = express.Router();
const filiereController = require('../controllers/fillieres.Controllers');
const authenticateAdmin = require('../middlewares/adminMiddleware');


router.post('/', authenticateAdmin('admin'), filiereController.createFiliere);
router.put('/:id', authenticateAdmin('admin'), filiereController.updateFiliere);
router.get('/:id', authenticateAdmin('admin'), filiereController.getFiliereById);
router.patch('/:id/deactivate', authenticateAdmin('admin'), filiereController.deactivateFiliere);
router.get('/', filiereController.getAllFilieres);

module.exports = router;
