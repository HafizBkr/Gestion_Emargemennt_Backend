const pool = require('../config/database');

class NiveauModel {
    // Créer un niveau
    async createNiveau(niveauData) {
        const { nom, description, filiere_id } = niveauData;

        const result = await pool.query(
            `INSERT INTO niveaux (nom, description, filiere_id)
            VALUES ($1, $2, $3) RETURNING *;`,
            [nom, description, filiere_id]
        );

        return result.rows[0];
    }

    // Récupérer tous les niveaux
    async getAllNiveaux() {
        const result = await pool.query("SELECT * FROM niveaux;");
        return result.rows;
    }

    // Récupérer un niveau par ID
    async getNiveauById(id) {
        const result = await pool.query(
            "SELECT * FROM niveaux WHERE id = $1;",
            [id]
        );
        return result.rows[0];
    }

    async GetNiveauById(niveauId) {
        try {
            // Effectuer une requête SQL pour récupérer le niveau basé sur l'ID
            const result = await pool.oneOrNone('SELECT * FROM niveaux WHERE id = $1', [niveauId]);
    
            // Si aucun niveau n'est trouvé, renvoyer null
            if (!result) {
                throw new Error('Niveau non trouvé');
            }
    
            // Retourner l'objet niveau
            return result;
        } catch (error) {
            console.error('Erreur lors de la récupération du niveau :', error);
            throw new Error('Erreur lors de la récupération du niveau');
        }
    }

    // Mettre à jour un niveau
    async updateNiveau(id, updateData) {
        const { nom, description, filiere_id } = updateData;

        const result = await pool.query(
            `UPDATE niveaux
            SET nom = $1, description = $2, filiere_id = $3
            WHERE id = $4 RETURNING *;`,
            [nom, description, filiere_id, id]
        );
        return result.rows[0];
    }

    // Supprimer un niveau
    async deleteNiveau(id) {
        const result = await pool.query(
            "DELETE FROM niveaux WHERE id = $1 RETURNING *;",
            [id]
        );
        return result.rows[0];
    }

    async getAllByFiliere(filiere_id) {
      const result = await pool.query(
          'SELECT * FROM niveaux WHERE filiere_id = $1;',
          [filiere_id]
      );
      return result.rows;
  }
}

module.exports = new NiveauModel();
