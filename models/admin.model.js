const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// Fonction pour afficher la base de données courante
const showCurrentDatabase = async () => {
    try {
        const query = 'SELECT current_database()';
        const res = await pool.query(query);
        console.log('Base de données courante:', res.rows[0].current_database);
    } catch (error) {
        console.error('Erreur lors de la récupération de la base de données courante:', error);
        throw error;
    }
};

// Fonction pour créer un administrateur
const createAdmin = async (email, password) => {
    try {
        // Afficher la base de données courante
        await showCurrentDatabase();

        // Vérifier si l'email existe déjà
        const checkEmailQuery = 'SELECT * FROM admins WHERE email = $1';
        const checkEmailRes = await pool.query(checkEmailQuery, [email]);

        if (checkEmailRes.rows.length > 0) {
            throw new Error('Cet email est déjà utilisé');
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'administrateur dans la base de données
        const insertQuery = 'INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(insertQuery, [email, hashedPassword]);

        return result.rows[0]; // Retourner l'administrateur créé
    } catch (error) {
        console.error('Erreur lors de la création de l\'administrateur:', error);
        throw error;
    }
};

// Fonction pour vérifier la connexion d'un administrateur
const loginAdmin = async (email, password) => {
    try {
        // Récupérer l'administrateur par email
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

        return admin; // Retourner l'administrateur si le mot de passe est valide
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'administrateur:', error);
        throw error;
    }
};

module.exports = { createAdmin, loginAdmin };
