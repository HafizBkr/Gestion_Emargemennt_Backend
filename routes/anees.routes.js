const express = require('express');
const router = express.Router();
const AnneeScolaireController = require('../controllers/anee.Controller');
const authenticateAdmin= require('../middlewares/adminMiddleware');


router.get('/', AnneeScolaireController.getAll);
router.get('/active', authenticateAdmin('admin'), AnneeScolaireController.getActive);
router.post('/', authenticateAdmin('admin'), AnneeScolaireController.create);
router.put('/:id', authenticateAdmin('admin'), AnneeScolaireController.update);
router.delete('/:id', authenticateAdmin('admin'), AnneeScolaireController.deactivate);

module.exports = router;
