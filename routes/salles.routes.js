const express = require('express');
const router = express.Router();
const SalleController = require('../controllers/salles.Controller');
const authenticateAdmin= require('../middlewares/adminMiddleware');


router.post('/', authenticateAdmin('admin'), SalleController.createSalle);
router.get('/', SalleController.getAllSalles);
router.get('/:id', SalleController.getSalleById);
router.put('/:id', authenticateAdmin('admin'), SalleController.updateSalle);
router.delete('/:id', authenticateAdmin('admin'), SalleController.deleteSalle);

module.exports = router;
