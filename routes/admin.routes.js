// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const { registerAdmin, login } = require('../controllers/admin.Controller'); 

// Route pour l'enregistrement d'un administrateur
router.post('/register', registerAdmin);

// Route pour la connexion d'un administrateur
router.post('/login', login);

module.exports = router;
