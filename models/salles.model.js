const pool = require('../config/database');

class SalleModel {
    // Créer une salle
    async createSalle(salleData) {
        const { nom, capacite, equipements, etage } = salleData;

        const result = await pool.query(
            `INSERT INTO salles (nom, capacite, equipements, etage)
            VALUES ($1, $2, $3, $4) RETURNING *;`,
            [nom, capacite, equipements, etage]
        );

        return result.rows[0];
    }

    // Récupérer toutes les salles
    async getAllSalles() {
        const result = await pool.query('SELECT * FROM salles;');
        return result.rows;
    }

    // Récupérer une salle spécifique par ID
    async getSalleById(id) {
        const result = await pool.query('SELECT * FROM salles WHERE id = $1;', [id]);
        return result.rows[0];
    }

    // Mettre à jour une salle
    async updateSalle(id, salleData) {
        const { nom, capacite, equipements, etage, disponible } = salleData;
        const result = await pool.query(
            `UPDATE salles
            SET nom = $1, capacite = $2, equipements = $3, etage = $4, disponible = $5
            WHERE id = $6 RETURNING *;`,
            [nom, capacite, equipements, etage, disponible, id]
        );
        return result.rows[0];
    }

    // Désactiver une salle
    async deactivateSalle(id) {
        const result = await pool.query(
            `UPDATE salles SET disponible = FALSE WHERE id = $1 RETURNING *;`,
            [id]
        );
        return result.rows[0];
    }
    static async getSalleById(id) {
        try {
            const result = await pool.query("SELECT * FROM salle WHERE id = $1", [id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error("Erreur lors de la récupération de la salle:", error);
            throw error;
        }
    }
    
}

module.exports = new SalleModel();
