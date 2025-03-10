const professeurModel = require('../models/professeurs.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class ProfesseurController {
    async createProfesseur(req, res) {
        const { nom, email, telephone, titre, role, actif, mot_de_passe } = req.body;
        try {
            const professeurExistant = await professeurModel.getProfesseurByEmail(email);
            if (professeurExistant) {
                return res.status(409).json({ error: "Un professeur avec cet email existe déjà." });
            }
        } catch (error) {
            return res.status(500).json({ error: `Erreur lors de la vérification de l'email: ${error.message}` });
        }
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(mot_de_passe.trim(), 10); // Utiliser .trim() pour supprimer les espaces blancs
        } catch (error) {
            return res.status(500).json({ error: `Erreur lors du hachage du mot de passe: ${error.message}` });
        }3 
        try {
            const professeur = await professeurModel.createProfesseur({
                nom,
                email,
                telephone,
                titre,
                role,
                actif,
                mot_de_passe: hashedPassword,
            });
            res.status(201).json({ professeur });
        } catch (error) {
            // Gestion spécifique de l'erreur de violation de contrainte d'unicité (au cas où la vérification préalable échoue)
            if (error.code === '23505' && error.constraint === 'professeurs_email_key') {
                return res.status(409).json({ error: "Un professeur avec cet email existe déjà." });
            }
            // Gestion des autres erreurs
            res.status(500).json({ error: `Erreur lors de la création du professeur: ${error.message}` });
        }
    }

    // Récupérer tous les professeurs
    // Récupérer tous les professeurs avec leurs domaines
async getAllProfesseurs(req, res) {
    try {
        const professeurs = await professeurModel.getAllProfesseurs();
        res.status(200).json({ professeurs });
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération des professeurs: ${error.message}` });
    }
}

    // Récupérer un professeur par ID
  // Récupérer un professeur par ID avec ses domaines associés
async getProfesseurById(req, res) {
    try {
        const professeur = await professeurModel.getProfesseurById(req.params.id);
        if (!professeur) {
            return res.status(404).json({ error: "Professeur non trouvé" });
        }

        // Récupérer les domaines associés au professeur
        const domaines = await professeurModel.getDomainesProfesseur(req.params.id);

        res.status(200).json({ professeur, domaines });
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération du professeur: ${error.message}` });
    }
}

    // Mettre à jour un professeur
    async updateProfesseur(req, res) {
        try {
            const professeur = await professeurModel.updateProfesseur(req.params.id, req.body);
            if (!professeur) {
                return res.status(404).json({ error: "Professeur non trouvé" });
            }
            res.status(200).json({ professeur });
        } catch (error) {
            res.status(500).json({ error: `Erreur lors de la mise à jour du professeur: ${error.message}` });
        }
    }

    // Supprimer un professeur
    async deleteProfesseur(req, res) {
        try {
            const professeur = await professeurModel.deleteProfesseur(req.params.id);
            if (!professeur) {
                return res.status(404).json({ error: "Professeur non trouvé" });
            }
            res.status(200).json({ message: "Professeur supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ error: `Erreur lors de la suppression du professeur: ${error.message}` });
        }
    }

    // Connecter un professeur
    async loginProfesseur(req, res) {
        const { email, mot_de_passe } = req.body;
    
        if (!email || !mot_de_passe) {
            return res.status(400).json({ error: "L'email et le mot de passe sont requis." });
        }
    
        try {
            const professeur = await professeurModel.getProfesseurByEmail(email);
            if (!professeur) {
                return res.status(404).json({ error: "Aucun professeur trouvé avec cet email." });
            }
    
            console.log("Mot de passe fourni :", mot_de_passe);
            console.log("Mot de passe haché stocké :", professeur.mot_de_passe);
    
            const isMatch = await bcrypt.compare(mot_de_passe.trim(), professeur.mot_de_passe.trim());
            if (!isMatch) {
                return res.status(400).json({ error: "Mot de passe incorrect." });
            }
    
            // Mettre à jour la date de dernière connexion
            await professeurModel.updateLastLogin(professeur.id);
    
            // Générer un token JWT
            const token = jwt.sign(
                {
                    id: professeur.id,
                    email: professeur.email,
                    role: professeur.role,
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
    
            // Renvoyer la réponse avec le token et une indication si le mot de passe doit être changé
            res.status(200).json({
                message: "Connexion réussie.",
                token,
                needPasswordChange: !professeur.mot_de_passe_change, // Ajout de l'indicateur
                professeur: {
                    id: professeur.id,
                    nom: professeur.nom,
                    email: professeur.email,
                    role: professeur.role,
                },
            });
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            res.status(500).json({ error: `Erreur lors de la connexion: ${error.message}` });
        }
    }
    

 
    async changePassword(req, res) {
        try {
            const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;
            const { id } = req.params; // Si l'ID est dans l'URL
    
            if (!id) {
                return res.status(400).json({ error: "ID du professeur manquant." });
            }
    
            if (!ancien_mot_de_passe || !nouveau_mot_de_passe) {
                return res.status(400).json({ error: "Tous les champs sont obligatoires." });
            }
    
            const professeur = await professeurModel.changePassword(id, ancien_mot_de_passe, nouveau_mot_de_passe);
            res.status(200).json({ message: "Mot de passe mis à jour avec succès.", professeur });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    


        // Activer ou désactiver un professeur
        async toggleActivationProfesseur(req, res) {
            const { id } = req.params;
            
            try {
                const professeur = await professeurModel.toggleActivation(id);
                if (!professeur) {
                    return res.status(404).json({ error: "Professeur non trouvé" });
                }
                res.status(200).json({ 
                    message: `Le compte du professeur a été ${professeur.actif ? "activé" : "désactivé"}.`, 
                    professeur 
                });
            } catch (error) {
                res.status(500).json({ error: `Erreur lors de la mise à jour de l'activation: ${error.message}` });
            }
        }
        async assignerDomaines(req, res) {
            const { id: professeur_id } = req.params;
            const { domaines } = req.body; // domaines = [id1, id2, ...]
        
            try {
                const result = await professeurModel.assignerDomaines(professeur_id, domaines);
                res.status(200).json(result);
            } catch (error) {
                res.status(500).json({ error: `Erreur lors de l'affectation des domaines: ${error.message}` });
            }
        }
        
        // 🔹 Récupérer les domaines d’un professeur
        async  getDomainesProfesseur(req, res) {
            const { id: professeur_id } = req.params;
        
            try {
                const domaines = await professeurModel.getDomainesProfesseur(professeur_id);
                res.status(200).json({ domaines });
            } catch (error) {
                res.status(500).json({ error: `Erreur lors de la récupération des domaines: ${error.message}` });
            }
        }
        
        // 🔹 Supprimer un domaine spécifique d’un professeur
        async  supprimerDomaineProfesseur(req, res) {
            const { id: professeur_id, domaine_id } = req.params;
        
            try {
                const result = await professeurModel.supprimerDomaineProfesseur(professeur_id, domaine_id);
                res.status(200).json(result);
            } catch (error) {
                res.status(500).json({ error: `Erreur lors de la suppression du domaine: ${error.message}` });
            }
        }
    
   // Récupérer les professeurs par domaine
// Dans votre contrôleur professeurController.js
async getProfesseursByDomaine(req, res) {
    const { domaine_id } = req.params;

    try {
        const professeurs = await professeurModel.getProfesseursByDomaine(domaine_id);
        res.status(200).json({ professeurs });
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération des professeurs par domaine: ${error.message}` });
    }
}



    
}

module.exports = new ProfesseurController();