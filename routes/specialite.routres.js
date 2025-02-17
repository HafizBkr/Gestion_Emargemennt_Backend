const express = require('express');
const router = express.Router();
const SpecialiteController = require('../controllers/specialite.Controller');
const authenticateAdmin = require('../middlewares/adminMiddleware');


router.post('/', authenticateAdmin('admin'), SpecialiteController.createSpecialite);
router.get('/', authenticateAdmin('admin'), SpecialiteController.getAllSpecialites);
router.get('/:id', authenticateAdmin('admin'), SpecialiteController.getSpecialiteById);
router.put('/:id', authenticateAdmin('admin'), SpecialiteController.updateSpecialite);
router.delete('/:id', authenticateAdmin('admin'), SpecialiteController.deleteSpecialite);
router.get('/filiere/:filiereId' ,authenticateAdmin('admin'), SpecialiteController.getSpecialitesByFiliere);

module.exports = router;
