const { createAdmin, loginAdmin } = require('../models/admin.model');
const jwt = require('jsonwebtoken');

// Register an admin
const registerAdmin = async (req, res) => {
    const { email, password, role = 'admin' } = req.body;  // Default to 'admin' if no role is provided

    try {
        const newAdmin = await createAdmin(email, password, role);
        res.status(201).json({ message: 'Administrateur créé avec succès', admin: newAdmin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Admin login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await loginAdmin(email, password);
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role },  // Include role in JWT payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ message: 'Connexion réussie', token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { registerAdmin, login };
