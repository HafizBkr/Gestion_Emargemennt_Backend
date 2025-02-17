const express = require('express');
const router = express.Router();
const ProgrammeController = require('../controllers/programes.Controller');
const authenticateAdmin = require('../middlewares/adminMiddleware');

router.post('/',authenticateAdmin('admin'), ProgrammeController.createProgramme);
router.get('/', ProgrammeController.getAllProgrammes);
router.get('/specialite/:specialiteId', ProgrammeController.getProgrammesBySpecialite);
router.put('/:id',authenticateAdmin('admin'), ProgrammeController.updateProgramme);
router.put('/:id/desactiver',authenticateAdmin('admin'), ProgrammeController.deactivateProgramme);

module.exports = router;
