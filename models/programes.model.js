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

    async getProgrammeById(id) {
        try {
            const result = await pool.query(`
                SELECT 
                    p.id, 
                    p.matiere AS course_name, 
                    p.code_matiere,
                    p.nombre_credits, 
                    p.volume_horaire, 
                    p.actif,
                    s.nom AS specialite, 
                    f.nom AS filiere
                FROM programmes p
                JOIN specialites s ON p.specialite_id = s.id
                JOIN niveaux n ON s.niveau_id = n.id
                JOIN filieres f ON n.filiere_id = f.id
                WHERE p.id = $1
            `, [id]);
            
            // Vérification que le résultat est non vide
            if (result.rows.length > 0) {
                return result.rows[0];  // Le programme a été trouvé
            } else {
                return null;  // Aucun programme trouvé
            }
        } catch (error) {
            console.error(`Erreur lors de la récupération du programme avec l'ID ${id}:`, error);
            throw error;
        }
    }
    
    async  getNiveauByProgrammeId(programmeId) {
        try {
            // Verify programme ID is provided
            if (!programmeId) {
                throw new Error('Programme ID is required');
            }
    
            // SQL query to join the necessary tables
            const query = `
                SELECT n.*
                FROM programmes p
                JOIN specialites s ON p.specialite_id = s.id
                JOIN niveaux n ON s.niveau_id = n.id
                WHERE p.id = $1
            `;
    
            // Execute the query
            const result = await pool.query(query, [programmeId]);
    
            // Check if any result was found
            if (result.rows.length === 0) {
                return null;
            }
    
            // Return the niveau information
            return result.rows[0];
        } catch (error) {
            console.error('Error in getNiveauByProgrammeId:', error);
            throw new Error(`Failed to get niveau: ${error.message}`);
        }
    }
    
}

module.exports = new ProgrammeModel();
