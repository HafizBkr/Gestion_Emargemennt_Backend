const pool = require("../config/database");

class EmargementModel {
    static async ajouterEmargementDebut(seanceId, professeurId) {
        try {
            // Vérifier si un émargement de début existe déjà pour ce professeur et cette séance
            const checkQuery = `SELECT COUNT(*) FROM emargements WHERE seance_id = $1 AND professeur_id = $2 AND type_emargement = 'debut'`;
            const checkResult = await pool.query(checkQuery, [seanceId, professeurId]);

            if (parseInt(checkResult.rows[0].count) > 0) {
                throw new Error("Un professeur ne peut émarger qu'une seule fois au début d'une séance.");
            }
            
            const seanceQuery = `
                SELECT heure_debut, heure_fin FROM seances WHERE id = $1
            `;
            const seanceResult = await pool.query(seanceQuery, [seanceId]);
            const { heure_debut, heure_fin } = seanceResult.rows[0];

            // Insérer l'émargement avec type 'debut'
            const insertQuery = `
                INSERT INTO emargements (id, seance_id, professeur_id, heure_debut, heure_fin, type_emargement)
                VALUES (gen_random_uuid(), $1, $2, $3, $4, 'debut') 
                RETURNING *;
            `;
            const result = await pool.query(insertQuery, [seanceId, professeurId, heure_debut, heure_fin]);

            // Mettre à jour le statut de la séance en "En Cours"
            await pool.query(`UPDATE seances SET statut = 'En Cours' WHERE id = $1`, [seanceId]);

            return result.rows[0]; // Retourne l'émargement ajouté
        } catch (error) {
            throw error;
        }
    }
    
    static async ajouterEmargementFin(seanceId, professeurId) {
        try {
            // Vérifier si un émargement de fin existe déjà pour ce professeur et cette séance
            const checkQuery = `SELECT COUNT(*) FROM emargements WHERE seance_id = $1 AND professeur_id = $2 AND type_emargement = 'fin'`;
            const checkResult = await pool.query(checkQuery, [seanceId, professeurId]);

            if (parseInt(checkResult.rows[0].count) > 0) {
                throw new Error("Un professeur ne peut émarger qu'une seule fois à la fin d'une séance.");
            }
            
            const seanceQuery = `
                SELECT heure_debut, heure_fin FROM seances WHERE id = $1
            `;
            const seanceResult = await pool.query(seanceQuery, [seanceId]);
            const { heure_debut, heure_fin } = seanceResult.rows[0];

            // Insérer l'émargement avec type 'fin'
            const insertQuery = `
                INSERT INTO emargements (id, seance_id, professeur_id, heure_debut, heure_fin, type_emargement)
                VALUES (gen_random_uuid(), $1, $2, $3, $4, 'fin') 
                RETURNING *;
            `;
            const result = await pool.query(insertQuery, [seanceId, professeurId, heure_debut, heure_fin]);

            // Mettre à jour le statut de la séance en "effectuée"
            await pool.query(`UPDATE seances SET statut = 'effectuée' WHERE id = $1`, [seanceId]);

            return result.rows[0]; // Retourne l'émargement ajouté
        } catch (error) {
            throw error;
        }
    }
    
    // Dans le modèle EmargementModel
    static async getSeanceById(seanceId) {
        const query = `
            SELECT * FROM seances WHERE id = $1
        `;
        const result = await pool.query(query, [seanceId]);
        return result.rows[0]; // Retourne la première ligne correspondant à l'id
    }

    // ➜ Vérifier si un professeur est programmé sur la séance
    static async verifierProfesseurSeance(seanceId, professeurId) {
        const query = `
            SELECT COUNT(*) FROM seances 
            WHERE id = $1 AND professeur_id = $2
        `;
        const result = await pool.query(query, [seanceId, professeurId]);
        return parseInt(result.rows[0].count) > 0; // true si le professeur est programmé sur cette séance
    }
    
    // ➜ Récupérer tous les émargements d'une séance
    static async getEmargementsBySeance(seance_id) {
        const query = "SELECT * FROM emargements WHERE seance_id = $1";
        const result = await pool.query(query, [seance_id]);
        return result.rows;
    }

    // ➜ Calculer le total des heures effectuées
    static async getTotalHeuresEffectuees(seance_id) {
        const query = `
            SELECT COALESCE(ROUND(SUM(EXTRACT(EPOCH FROM (heure_fin - heure_debut)) / 3600), 2), 0) AS total_heures
            FROM emargements
            WHERE seance_id = $1;
        `;
        const result = await pool.query(query, [seance_id]);
        return result.rows[0]?.total_heures || 0;
    }
    
    static async checkVolumeHoraire(programmeId) {
        const query = `
            SELECT 
                p.matiere,
                p.code_matiere,
                p.volume_horaire,
                COALESCE(SUM(EXTRACT(EPOCH FROM (s.heure_fin - s.heure_debut)) / 3600), 0) AS totalHeuresEffectuees,
                COALESCE(p.volume_horaire - SUM(EXTRACT(EPOCH FROM (s.heure_fin - s.heure_debut)) / 3600), p.volume_horaire) AS volumeHoraireRestant
            FROM programmes p
            LEFT JOIN seances s ON s.programme_id = p.id AND s.statut = 'effectuée'
            WHERE p.id = $1
            GROUP BY p.id, p.matiere, p.code_matiere, p.volume_horaire;
        `;
        
        try {
            const result = await pool.query(query, [programmeId]);
            
            if (!result.rows[0]) {
                throw new Error(`Programme non trouvé avec l'ID: ${programmeId}`);
            }
            
            return {
                matiere: result.rows[0].matiere,
                code_matiere: result.rows[0].code_matiere,
                volume_horaire: parseInt(result.rows[0].volume_horaire),
                totalHeuresEffectuees: parseFloat(result.rows[0].totalheureseffectuees),
                volumeHoraireRestant: parseFloat(result.rows[0].volumehorairerestant)
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = EmargementModel;