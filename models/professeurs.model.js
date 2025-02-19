const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class ProfesseurModel {
    // Créer un professeur
    async createProfesseur(professorData) {
        const { nom, email, telephone, titre, role, actif, mot_de_passe } = professorData;

        // Hacher le mot de passe

        // Insérer le professeur avec le mot de passe haché
        const result = await pool.query(
            `INSERT INTO professeurs (nom, email, telephone, titre, role, actif, mot_de_passe)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
            [nom, email, telephone, titre, role, actif, mot_de_passe]
        );

        return result.rows[0];
    }

    // Récupérer tous les professeurs
    // Récupérer tous les professeurs avec leurs domaines associés
async getAllProfesseurs() {
    const result = await pool.query(`
        SELECT p.*, array_agg(d.nom) AS domaines
        FROM professeurs p
        LEFT JOIN professeur_domaine pd ON p.id = pd.professeur_id
        LEFT JOIN domaines d ON pd.domaine_id = d.id
        GROUP BY p.id;
    `);
    return result.rows;
}

    // Récupérer un professeur par ID
    async getProfesseurById(id) {
        const result = await pool.query(
            "SELECT * FROM professeurs WHERE id = $1;",
            [id]
        );
        return result.rows[0];
    }

    // Récupérer un professeur par email
    async getProfesseurByEmail(email) {
        const result = await pool.query(
            "SELECT * FROM professeurs WHERE email = $1;",
            [email]
        );
        return result.rows[0];
    }

    // Mettre à jour un professeur
    async updateProfesseur(id, updateData) {
        const { nom, email, telephone, titre, role, actif, mot_de_passe } = updateData;
        
        let updateFields = [nom, email, telephone, titre, role, actif];
        let updateQuery = `
            UPDATE professeurs
            SET nom = $1, email = $2, telephone = $3, titre = $4, role = $5, actif = $6
        `;

        if (mot_de_passe) {
            const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
            updateFields.push(hashedPassword);
            updateQuery += `, mot_de_passe = $${updateFields.length}`;
            updateQuery += `, mot_de_passe_change = TRUE`;
        }

        updateQuery += `, date_mise_a_jour = NOW() WHERE id = $${updateFields.length + 1} RETURNING *;`;
        updateFields.push(id);

        const result = await pool.query(updateQuery, updateFields);
        return result.rows[0];
    }

    // Supprimer un professeur
    async deleteProfesseur(id) {
        const result = await pool.query(
            "DELETE FROM professeurs WHERE id = $1 RETURNING *;",
            [id]
        );
        return result.rows[0];
    }

    
    async changePassword(id, ancien_mot_de_passe, nouveau_mot_de_passe) {
        if (!ancien_mot_de_passe || !nouveau_mot_de_passe) {
            throw new Error("Les champs 'ancien_mot_de_passe' et 'nouveau_mot_de_passe' sont requis.");
        }
    
        const professeur = await pool.query("SELECT mot_de_passe FROM professeurs WHERE id = $1", [id]);
    
        if (!professeur.rows.length) {
            throw new Error("Professeur introuvable.");
        }
    
        const mot_de_passe_hash = professeur.rows[0].mot_de_passe;
        if (!mot_de_passe_hash) {
            throw new Error("Erreur: mot de passe non défini en base.");
        }
    
        const match = await bcrypt.compare(ancien_mot_de_passe, mot_de_passe_hash);
        if (!match) {
            throw new Error("Ancien mot de passe incorrect.");
        }
    
        const nouveauHash = await bcrypt.hash(nouveau_mot_de_passe, 10);
        await pool.query("UPDATE professeurs SET mot_de_passe = $1, date_mise_a_jour = NOW() WHERE id = $2", [nouveauHash, id]);
    
        return { message: "Mot de passe mis à jour avec succès." };
    }
    

    // Mettre à jour la date de dernière connexion
    async updateLastLogin(id) {
        await pool.query(
            "UPDATE professeurs SET date_derniere_connexion = NOW() WHERE id = $1;",
            [id]
        );
    }

        // Activer ou désactiver un professeur
        async toggleActivation(id) {
            const result = await pool.query(
                `UPDATE professeurs 
                SET actif = NOT actif, date_mise_a_jour = now()
                WHERE id = $1 
                RETURNING *;`,
                [id]
            );
            return result.rows[0];
        }

        async assignerDomaines(professeur_id, domaines) {
            if (!Array.isArray(domaines) || domaines.length === 0) {
                throw new Error("Le tableau des domaines est invalide.");
            }
    
            const client = await pool.connect();
            try {
                await client.query("BEGIN");
    
                // Supprimer les anciennes associations
                await client.query("DELETE FROM professeur_domaine WHERE professeur_id = $1;", [professeur_id]);
    
                // Insérer les nouvelles associations en une seule requête optimisée
                const values = domaines.map((domaine_id) => `('${professeur_id}', '${domaine_id}')`).join(",");
                await client.query(
                    `INSERT INTO professeur_domaine (professeur_id, domaine_id) VALUES ${values} 
                     ON CONFLICT DO NOTHING;`
                );
    
                await client.query("COMMIT");
                return { message: "Domaines mis à jour avec succès." };
            } catch (error) {
                await client.query("ROLLBACK");
                throw error;
            } finally {
                client.release();
            }
        }
    
        // 🔹 Récupérer les domaines d'un professeur
        async getDomainesProfesseur(professeur_id) {
            const result = await pool.query(
                `SELECT d.id, d.nom FROM domaines d
                 INNER JOIN professeur_domaine pd ON d.id = pd.domaine_id
                 WHERE pd.professeur_id = $1;`,
                [professeur_id]
            );
            return result.rows;
        }
    
        // 🔹 Supprimer un domaine spécifique d’un professeur
        async supprimerDomaineProfesseur(professeur_id, domaine_id) {
            const result = await pool.query(
                `DELETE FROM professeur_domaine WHERE professeur_id = $1 AND domaine_id = $2 RETURNING *;`,
                [professeur_id, domaine_id]
            );
            if (result.rowCount === 0) {
                throw new Error("Aucune association trouvée.");
            }
            return { message: "Domaine supprimé avec succès." };
        }
    
        // Récupérer les domaines associés à un professeur
  // Récupérer les professeurs associés à un domaine
async getProfesseursByDomaine(domaine_id) {
    const result = await pool.query(
        `SELECT p.* FROM professeurs p
         JOIN professeur_domaine pd ON p.id = pd.professeur_id
         WHERE pd.domaine_id = $1;`,
        [domaine_id]
    );
    return result.rows;
}

 async getProfesseurById(id) {
    try {
        const result = await pool.query(
            'SELECT id, nom, email, telephone FROM public.professeurs WHERE id = $1',
            [id]
        );
        return result.rows[0]; // Retourne les informations du professeur
    } catch (error) {
        console.error("Erreur lors de la récupération du professeur:", error);
        throw new Error('Erreur lors de la récupération des informations du professeur');
    }
}
}

module.exports = new ProfesseurModel();