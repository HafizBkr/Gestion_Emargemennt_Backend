const express = require('express');
const SeanceController = require('../controllers/senace.Controller');
const authenticateAdmin = require('../middlewares/adminMiddleware');
const authMiddleware = require('../middlewares/userMiddleware');
const router = express.Router();

router.get('/', SeanceController.getAllSeances);
router.get('/mes-seances', authMiddleware, SeanceController.getSeancesByProfesseur);
router.get('/:id', SeanceController.getSeanceById);
router.post('/', authenticateAdmin('admin'), SeanceController.createSeance);
router.put('/:id', authenticateAdmin('admin'), SeanceController.updateSeance);
router.delete('/:id', authenticateAdmin('admin'), SeanceController.deleteSeance);
router.get('/niveau/:niveauId', SeanceController.getSeancesByNiveau);


module.exports = router;
