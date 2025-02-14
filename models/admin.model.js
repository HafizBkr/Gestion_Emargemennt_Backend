const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// Create an admin with role
const createAdmin = async (email, password, role = 'admin') => {
    try {
        // Check if the email already exists
        const checkEmailQuery = 'SELECT * FROM admins WHERE email = $1';
        const checkEmailRes = await pool.query(checkEmailQuery, [email]);

        if (checkEmailRes.rows.length > 0) {
            throw new Error('Cet email est déjà utilisé');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the admin with role into the database
        const insertQuery = 'INSERT INTO admins (email, password, role) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(insertQuery, [email, hashedPassword, role]);

        return result.rows[0]; // Return the created admin
    } catch (error) {
        console.error('Erreur lors de la création de l\'administrateur:', error);
        throw error;
    }
};

// Verify admin login
const loginAdmin = async (email, password) => {
    try {
        // Get the admin by email
        const query = 'SELECT * FROM admins WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            throw new Error('Email ou mot de passe incorrect');
        }

        const admin = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new Error('Email ou mot de passe incorrect');
        }

        return admin; // Return the admin if password is valid
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'administrateur:', error);
        throw error;
    }
};

module.exports = { createAdmin, loginAdmin };
