const pool = require("../config/database");

class DomaineModel {
    // 🔹 Créer un domaine
    async creerDomaine(nom) {
        const result = await pool.query(
            `INSERT INTO domaines (nom) VALUES ($1) RETURNING *;`,
            [nom]
        );
        return result.rows[0];
    }

    // 🔹 Récupérer tous les domaines
    async getAllDomaines() {
        const result = await pool.query(`SELECT * FROM domaines ORDER BY nom ASC;`);
        return result.rows;
    }

    // 🔹 Récupérer un domaine par ID
    async getDomaineById(id) {
        const result = await pool.query(
            `SELECT * FROM domaines WHERE id = $1;`,
            [id]
        );
        if (result.rowCount === 0) {
            throw new Error("Domaine non trouvé.");
        }
        return result.rows[0];
    }

    // 🔹 Mettre à jour un domaine
    async updateDomaine(id, nom) {
        const result = await pool.query(
            `UPDATE domaines SET nom = $1 WHERE id = $2 RETURNING *;`,
            [nom, id]
        );
        if (result.rowCount === 0) {
            throw new Error("Domaine non trouvé.");
        }
        return result.rows[0];
    }

    // 🔹 Supprimer un domaine
    async deleteDomaine(id) {
        const result = await pool.query(
            `DELETE FROM domaines WHERE id = $1 RETURNING *;`,
            [id]
        );
        if (result.rowCount === 0) {
            throw new Error("Domaine non trouvé.");
        }
        return { message: "Domaine supprimé avec succès." };
    }
}

module.exports = new DomaineModel();
