const EmargementModel = require("../models/emargement.model");

class EmargementController {
    // ➜ Ajouter un émargement
    static async ajouterEmargement(req, res) {
        try {
            const { seance_id } = req.params;
            const { id: professeur_id, role } = req.professeur; // Récupère l'ID et rôle du professeur à partir du token

            // Si l'utilisateur est un admin, il peut émarger sans restriction
            if (role === "admin") {
                const emargement = await EmargementModel.ajouterEmargement(seance_id, professeur_id);
                return res.status(201).json({ message: "Émargement ajouté avec succès", emargement });
            }

            // Vérifier si le professeur est bien programmé sur cette séance
            const estProgramme = await EmargementModel.verifierProfesseurSeance(seance_id, professeur_id);
            if (!estProgramme) {
                return res.status(403).json({ message: "Accès refusé : vous n'êtes pas programmé sur cette séance." });
            }

            // Ajouter l'émargement
            const emargement = await EmargementModel.ajouterEmargement(seance_id, professeur_id);
            res.status(201).json({ message: "Émargement ajouté avec succès", emargement });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message || "Erreur interne du serveur" });
        }
    }
    

    // ➜ Récupérer les émargements d’une séance
    static async getEmargementsBySeance(req, res) {
        try {
            const { seance_id } = req.params;
            const emargements = await EmargementModel.getEmargementsBySeance(seance_id);
            res.status(200).json(emargements);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }

    // ➜ Obtenir le total des heures effectuées
    static async getTotalHeuresEffectuees(req, res) {
        try {
            const { programme_id } = req.params;
            
            if (!programme_id) {
                return res.status(400).json({ message: "programme_id est requis" });
            }
        
            const result = await EmargementModel.checkVolumeHoraire(programme_id);
            
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = EmargementController;
