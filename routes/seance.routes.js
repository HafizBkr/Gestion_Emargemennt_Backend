const express = require('express');
const SeanceController = require('../controllers/senace.Controller');

const router = express.Router();

router.get('/', SeanceController.getAllSeances);
router.get('/:id', SeanceController.getSeanceById);
router.post('/', SeanceController.createSeance);
router.put('/:id', SeanceController.updateSeance);
router.delete('/:id', SeanceController.deleteSeance);

module.exports = router;
