const pool = require('../config/database'); // Connexion à la base de données

// Créer une nouvelle filière
async function createFiliere(nom, code, departement_id, description = "") {
    const result = await pool.query(
        `INSERT INTO filieres (nom, code, departement_id, description)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [nom, code, departement_id, description]
    );
    return result.rows[0];
}

// Mettre à jour une filière
async function updateFiliere(id, nom, code, departement_id, description = "") {
    const result = await pool.query(
        `UPDATE filieres
        SET nom = $1, code = $2, departement_id = $3, description = $4, date_mise_a_jour = NOW()
        WHERE id = $5 RETURNING *`,
        [nom, code, departement_id, description, id]
    );
    return result.rows[0];
}

// Récupérer une filière par ID
async function getFiliereById(id) {
    const result = await pool.query(
        'SELECT * FROM filieres WHERE id = $1',
        [id]
    );
    return result.rows[0];
}

// Désactiver une filière
async function deactivateFiliere(id) {
    const result = await pool.query(
        `UPDATE filieres
        SET actif = FALSE, date_mise_a_jour = NOW()
        WHERE id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0];
}

// Récupérer toutes les filières
async function getAllFilieres() {
    const result = await pool.query(
        'SELECT * FROM filieres'
    );
    return result.rows;
}

module.exports = {
    createFiliere,
    updateFiliere,
    getFiliereById,
    deactivateFiliere,
    getAllFilieres
};
