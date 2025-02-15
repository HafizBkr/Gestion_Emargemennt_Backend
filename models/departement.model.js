const pool = require('../config/database');



// Insérer un département et mettre à jour le rôle du responsable
const insertDepartement = async (nom, code, responsableID) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Vérifier si le responsable est déjà affecté à un autre département
        const checkResponsable = await client.query(
            `SELECT * FROM departements WHERE responsable_id = $1`,
            [responsableID]
        );

        if (checkResponsable.rows.length > 0) {
            // Le responsable est déjà affecté à un autre département
            throw new Error("Ce professeur est déjà responsable d'un autre département.");
        }

        // Si tout est ok, insérer le département
        const result = await client.query(
            `INSERT INTO departements (nom, code, responsable_id) 
             VALUES ($1, $2, $3) RETURNING *`,
            [nom, code, responsableID]
        );

        if (responsableID) {
            // Mettre à jour le rôle du professeur en "responsable"
            await client.query(`UPDATE professeurs SET role = 'responsable' WHERE id = $1`, [responsableID]);
        }

        await client.query("COMMIT");
        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

// Récupérer tous les départements
const getAllDepartements = async () => {
    const result = await pool.query(`
        SELECT d.*, p.nom AS responsable_nom
        FROM departements d
        LEFT JOIN professeurs p ON d.responsable_id = p.id
    `);
    return result.rows;
};

//  Récupérer un département par ID
const getDepartementById = async (id) => {
    const result = await pool.query(`SELECT * FROM departements WHERE id = $1`, [id]);
    return result.rows[0];
};

//  Mettre à jour un département
const updateDepartement = async (id, nom, code, responsableID) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE departements 
             SET nom = $1, code = $2, responsable_id = $3, date_mise_a_jour = NOW() 
             WHERE id = $4 RETURNING *`,
            [nom, code, responsableID, id]
        );

        if (responsableID) {
            await client.query(`UPDATE professeurs SET role = 'responsable' WHERE id = $1`, [responsableID]);
        }

        await client.query("COMMIT");
        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

//  Supprimer un département
const deleteDepartement = async (id) => {
    const result = await pool.query(
        "DELETE FROM departements WHERE id = $1 RETURNING *", 
        [id]
    );
    return result; // result contiendra rowCount et les lignes supprimées, ce qui est utile
};
//  Activer/Désactiver un département
const toggleDepartement = async (id) => {
    // Récupérer l'état actuel du département
    const result = await pool.query(
        `SELECT actif FROM departements WHERE id = $1`,
        [id]
    );
    
    if (result.rows.length === 0) {
        throw new Error('Département non trouvé');
    }

    // Basculer l'état de 'actif'
    const currentActif = result.rows[0].actif;
    const newActif = !currentActif;  // Si actif est true, le passer à false, et vice versa

    // Mettre à jour l'état du département
    await pool.query(
        `UPDATE departements SET actif = $1, date_mise_a_jour = NOW() WHERE id = $2`,
        [newActif, id]
    );
};


module.exports = {
    insertDepartement,
    getAllDepartements,
    getDepartementById,
    updateDepartement,
    deleteDepartement,
    toggleDepartement,
};
