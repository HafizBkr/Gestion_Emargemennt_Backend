const pool = require('../config/database');

class SeanceModel {
    static async getAllSeances() {
        const query = `
            SELECT 
                s.id, 
                s.date, 
                s.heure_debut, 
                s.heure_fin,
                to_char(s.date, 'Day') AS jour_semaine,  
                s.statut, 
                p.matiere AS programme_nom,   
                sp.nom AS programme_specialite,  -- Jointure avec la table 'specialites'
                pr.nom AS professeur_nom,
                pr.email AS professeur_email,
                sa.nom AS salle_nom, 
                sa.capacite AS salle_capacite, 
                sa.equipements AS salle_equipements
            FROM seances s
            JOIN programmes p ON s.programme_id = p.id
            JOIN specialites sp ON p.specialite_id = sp.id  -- Jointure avec la table 'specialites'
            JOIN professeurs pr ON s.professeur_id = pr.id
            JOIN salles sa ON s.salle_id = sa.id
            ORDER BY s.date DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }
    
    

    static async getSeanceById(id) {
        const query = `
            SELECT 
                s.id, 
                s.date, 
                s.heure_debut, 
                s.heure_fin,
                to_char(s.date, 'Day') AS jour_semaine,
                s.statut,
                p.nom AS programme_nom, 
                p.specialite AS programme_specialite,
                pr.nom AS professeur_nom,
                pr.email AS professeur_email,
                sa.nom AS salle_nom, 
                sa.capacite AS salle_capacite, 
                sa.equipements AS salle_equipements
            FROM seances s
            JOIN programmes p ON s.programme_id = p.id
            JOIN professeurs pr ON s.professeur_id = pr.id
            JOIN salles sa ON s.salle_id = sa.id
            WHERE s.id = $1;
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async createSeance({ date, heure_debut, heure_fin, programme_id, professeur_id, salle_id }) {
        const query = `
            INSERT INTO seances (date, heure_debut, heure_fin, programme_id, professeur_id, salle_id, statut)
            VALUES ($1, $2, $3, $4, $5, $6, 'en cours')
            RETURNING id, professeur_id;  -- Retourner aussi le professeur_id pour récupérer l'email
        `;
        const result = await pool.query(query, [date, heure_debut, heure_fin, programme_id, professeur_id, salle_id]);
        
        // Récupérer l'email du professeur en utilisant son ID
        const professeurQuery = `
            SELECT email 
            FROM professeurs 
            WHERE id = $1;
        `;
        const professeurResult = await pool.query(professeurQuery, [result.rows[0].professeur_id]);
    
        // Renvoyer l'email du professeur avec la séance créée
        return { ...result.rows[0], professeur_email: professeurResult.rows[0]?.email };
    }

    static async updateSeance(id, { date, heure_debut, heure_fin, programme_id, professeur_id, salle_id, statut }) {
        const query = `
            UPDATE seances 
            SET date = $1, heure_debut = $2, heure_fin = $3, programme_id = $4, professeur_id = $5, salle_id = $6, statut = $7
            WHERE id = $8
            RETURNING *;
        `;
        const result = await pool.query(query, [date, heure_debut, heure_fin, programme_id, professeur_id, salle_id, statut, id]);
        return result.rows[0];
    }

    static async getProfesseurById(professeur_id) {
        const query = 'SELECT email FROM professeurs WHERE id = $1';
        const result = await pool.query(query, [professeur_id]);
        return result.rows[0]; // Retourne l'email du professeur
    }

    static async deleteSeance(id) {
        const query = `DELETE FROM seances WHERE id = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

   // models/SeanceModel.js

static async findSeance({ programme_id, salle_id, professeur_id, date, heure_debut, heure_fin }) {
    const query = `
        SELECT * FROM seances 
        WHERE programme_id = $1 
        AND salle_id = $2 
        AND professeur_id = $3 
        AND date = $4 
        AND heure_debut = $5 
        AND heure_fin = $6
    `;
    const values = [programme_id, salle_id, professeur_id, date, heure_debut, heure_fin];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];  // Si une séance existe déjà, retourner la première ligne
    } catch (error) {
        console.error("Erreur lors de la recherche de séance:", error);
        throw error;
    }
}

}

module.exports = SeanceModel;
