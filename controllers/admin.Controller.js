// controllers/adminController.js
const { createAdmin, loginAdmin } = require('../models/admin.model');
const jwt = require('jsonwebtoken');

const registerAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const newAdmin = await createAdmin(email, password);
        res.status(201).json({ message: 'Administrateur créé avec succès', admin: newAdmin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await loginAdmin(email, password);
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ message: 'Connexion réussie', token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { registerAdmin, login };
