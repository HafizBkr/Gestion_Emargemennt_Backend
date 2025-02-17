const pool = require('../config/database');

class ProgrammeModel {
    // Créer un programme avec l'année scolaire
    async createProgramme(programmeData) {
        const { specialite_id, matiere, code_matiere, nombre_credits, volume_horaire, annee_scolaire_id } = programmeData;

        const result = await pool.query(
            `INSERT INTO programmes (specialite_id, matiere, code_matiere, nombre_credits, volume_horaire, annee_scolaire_id, actif)
            VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING *;`,
            [specialite_id, matiere, code_matiere, nombre_credits, volume_horaire, annee_scolaire_id]
        );

        return result.rows[0];
    }

    // Récupérer tous les programmes avec nom de la spécialité et année scolaire
    async getAllProgrammes() {
        const result = await pool.query(`
            SELECT p.*, s.nom AS specialite_nom, a.start_date AS annee_scolaire_start, a.end_date AS annee_scolaire_end
            FROM programmes p
            JOIN specialites s ON p.specialite_id = s.id
            JOIN annees_scolaires a ON p.annee_scolaire_id = a.id;
        `);
        return result.rows;
    }

    // Récupérer les programmes d'une spécialité avec le nom de la spécialité et l'année scolaire
    async getProgrammesBySpecialite(specialiteId) {
        const result = await pool.query(`
            SELECT p.*, s.nom AS specialite_nom, a.start_date AS annee_scolaire_start, a.end_date AS annee_scolaire_end
            FROM programmes p
            JOIN specialites s ON p.specialite_id = s.id
            JOIN annees_scolaires a ON p.annee_scolaire_id = a.id
            WHERE p.specialite_id = $1;
        `, [specialiteId]);

        return result.rows;
    }

    // Mettre à jour un programme
    async updateProgramme(id, updateData) {
        const { matiere, code_matiere, nombre_credits, volume_horaire, annee_scolaire_id } = updateData;

        const result = await pool.query(
            `UPDATE programmes
            SET matiere = $1, code_matiere = $2, nombre_credits = $3, volume_horaire = $4, annee_scolaire_id = $5
            WHERE id = $6 RETURNING *;`,
            [matiere, code_matiere, nombre_credits, volume_horaire, annee_scolaire_id, id]
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
