const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.Controller');


// Route pour enregistrer un administrateur
router.post('/register', adminController.registerAdmin);

// Route pour connecter un administrateur et obtenir un token
router.post('/login', adminController.login);



module.exports = router;