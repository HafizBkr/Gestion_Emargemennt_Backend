const pool = require('../config/database');

class ProgrammeModel {
    // Créer un programme
    async createProgramme(programmeData) {
        const { specialite_id, matiere, code_matiere, nombre_credits, volume_horaire } = programmeData;

        const result = await pool.query(
            `INSERT INTO programmes (specialite_id, matiere, code_matiere, nombre_credits, volume_horaire, actif)
            VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING *;`,
            [specialite_id, matiere, code_matiere, nombre_credits, volume_horaire]
        );

        return result.rows[0];
    }

    // Récupérer tous les programmes avec nom de la spécialité
    async getAllProgrammes() {
        const result = await pool.query(`
            SELECT p.*, s.nom AS specialite_nom
            FROM programmes p
            JOIN specialites s ON p.specialite_id = s.id;
        `);
        return result.rows;
    }

    // Récupérer les programmes d'une spécialité avec le nom de la spécialité
    async getProgrammesBySpecialite(specialiteId) {
        const result = await pool.query(`
            SELECT p.*, s.nom AS specialite_nom
            FROM programmes p
            JOIN specialites s ON p.specialite_id = s.id
            WHERE p.specialite_id = $1;
        `, [specialiteId]);

        return result.rows;
    }

    // Mettre à jour un programme
    async updateProgramme(id, updateData) {
        const { matiere, code_matiere, nombre_credits, volume_horaire } = updateData;

        const result = await pool.query(
            `UPDATE programmes
            SET matiere = $1, code_matiere = $2, nombre_credits = $3, volume_horaire = $4
            WHERE id = $5 RETURNING *;`,
            [matiere, code_matiere, nombre_credits, volume_horaire, id]
        );
        return result.rows[0];
    }

    // Désactiver un programme
    async deactivateProgramme(id) {
        const result = await pool.query(
            `UPDATE programmes SET actif = FALSE WHERE id = $1 RETURNING *;`,
            [id]
        );
        return result.rows[0];
    }
}

module.exports = new ProgrammeModel();
