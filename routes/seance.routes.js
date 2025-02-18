const express = require('express');
const SeanceController = require('../controllers/senace.Controller');
const authenticateAdmin = require('../middlewares/adminMiddleware');
const router = express.Router();

router.get('/', SeanceController.getAllSeances);
router.get('/:id', SeanceController.getSeanceById);
router.post('/', authenticateAdmin('admin'), SeanceController.createSeance);
router.put('/:id', authenticateAdmin('admin'), SeanceController.updateSeance);
router.delete('/:id', authenticateAdmin('admin'), SeanceController.deleteSeance);
router.get('/niveau/:niveauId', SeanceController.getSeancesByNiveau);

module.exports = router;
