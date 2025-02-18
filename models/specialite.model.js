const pool = require('../config/database');

class SpecialiteModel {
    // Créer une spécialité
    async createSpecialite(specialiteData) {
        const { nom, description, niveau_id } = specialiteData;

        const result = await pool.query(
            `INSERT INTO specialites (nom, description, niveau_id)
            VALUES ($1, $2, $3) RETURNING *;`,
            [nom, description, niveau_id]
        );

        return result.rows[0];
    }

    // Récupérer toutes les spécialités avec niveau et filière associés
    async getAllSpecialites() {
        const result = await pool.query(
            `SELECT s.*, n.nom AS niveau_nom, f.nom AS filiere_nom
            FROM specialites s
            JOIN niveaux n ON n.id = s.niveau_id
            JOIN filieres f ON f.id = n.filiere_id;`
        );
        return result.rows;
    }

    // Récupérer une spécialité par ID avec niveau et filière associés
    async getSpecialiteById(id) {
        const result = await pool.query(
            `SELECT s.*, n.nom AS niveau_nom, f.nom AS filiere_nom
            FROM specialites s
            JOIN niveaux n ON n.id = s.niveau_id
            JOIN filieres f ON f.id = n.filiere_id
            WHERE s.id = $1;`,
            [id]
        );
        return result.rows[0];
    }

    // Mettre à jour une spécialité
    async updateSpecialite(id, updateData) {
        const { nom, description, niveau_id } = updateData;

        const result = await pool.query(
            `UPDATE specialites
            SET nom = $1, description = $2, niveau_id = $3
            WHERE id = $4 RETURNING *;`,
            [nom, description, niveau_id, id]
        );

        const specialite = result.rows[0];

        // Récupérer les informations du niveau et de la filière associés
        const niveauResult = await pool.query(
            `SELECT n.nom AS niveau_nom, f.nom AS filiere_nom
             FROM niveaux n
             JOIN filieres f ON f.id = n.filiere_id
             WHERE n.id = $1`,
            [specialite.niveau_id]
        );

        // Ajouter les informations du niveau et de la filière à la spécialité mise à jour
        specialite.niveau_nom = niveauResult.rows[0].niveau_nom;
        specialite.filiere_nom = niveauResult.rows[0].filiere_nom;

        return specialite;
    }

    // Supprimer une spécialité et récupérer les informations du niveau et de la filière
    async deleteSpecialite(id) {
        const result = await pool.query(
            `SELECT * FROM specialites WHERE id = $1;`,
            [id]
        );
        
        const specialite = result.rows[0];
        
        if (!specialite) {
            return null;
        }

        // Supprimer la spécialité
        await pool.query(
            "DELETE FROM specialites WHERE id = $1;",
            [id]
        );

        // Récupérer les informations du niveau et de la filière
        const niveauResult = await pool.query(
            `SELECT n.nom AS niveau_nom, f.nom AS filiere_nom
             FROM niveaux n
             JOIN filieres f ON f.id = n.filiere_id
             WHERE n.id = $1`,
            [specialite.niveau_id]
        );

        specialite.niveau_nom = niveauResult.rows[0].niveau_nom;
        specialite.filiere_nom = niveauResult.rows[0].filiere_nom;

        return specialite;
    }
    // Dans SpecialiteModel.js

async getSpecialitesByFiliere(filiereId) {
    const result = await pool.query(
        `SELECT specialites.*, niveaux.nom AS niveau_nom, filieres.nom AS filiere_nom
        FROM specialites
        JOIN niveaux ON specialites.niveau_id = niveaux.id
        JOIN filieres ON niveaux.filiere_id = filieres.id
        WHERE filieres.id = $1;`, 
        [filiereId]
    );

    return result.rows;
}

// Récupérer les programmes par niveau
async getProgrammesByNiveau(niveauId) {
    // 1. Récupérer toutes les spécialités associées au niveau
    const specialitesResult = await pool.query(
        `SELECT s.*, f.nom AS filiere_nom
         FROM specialites s
         JOIN niveaux n ON s.niveau_id = n.id
         JOIN filieres f ON n.filiere_id = f.id
         WHERE n.id = $1;`, 
        [niveauId]
    );
    
    if (specialitesResult.rows.length === 0) {
        return { message: "Aucune spécialité trouvée pour ce niveau" };
    }

    // 2. Pour chaque spécialité, récupérer les programmes associés
    const programmes = [];

    for (let specialite of specialitesResult.rows) {
        const programmesResult = await pool.query(
            `SELECT p.*, a.start_date AS annee_scolaire_start, a.end_date AS annee_scolaire_end
             FROM programmes p
             JOIN annees_scolaires a ON p.annee_scolaire_id = a.id
             WHERE p.specialite_id = $1;`, 
            [specialite.id]
        );

        specialite.programmes = programmesResult.rows;
        programmes.push(specialite);
    }

    return programmes;
}


}

module.exports = new SpecialiteModel();
