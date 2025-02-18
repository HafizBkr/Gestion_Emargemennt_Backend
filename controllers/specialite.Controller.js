const specialiteModel = require('../models/specialite.model');
const SpecialiteModel = require('../models/specialite.model');

class SpecialiteController {
    // Créer une spécialité
    async createSpecialite(req, res) {
        try {
            const specialite = await SpecialiteModel.createSpecialite(req.body);
            res.status(201).json(specialite);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Récupérer toutes les spécialités avec niveau et filière
    async getAllSpecialites(req, res) {
        try {
            const specialites = await SpecialiteModel.getAllSpecialites();
            res.status(200).json(specialites);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Récupérer une spécialité par ID avec niveau et filière
    async getSpecialiteById(req, res) {
        try {
            const specialite = await SpecialiteModel.getSpecialiteById(req.params.id);
            if (!specialite) {
                return res.status(404).json({ message: 'Spécialité non trouvée' });
            }
            res.status(200).json(specialite);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Mettre à jour une spécialité avec niveau et filière
    async updateSpecialite(req, res) {
        try {
            const specialite = await SpecialiteModel.updateSpecialite(req.params.id, req.body);
            if (!specialite) {
                return res.status(404).json({ message: 'Spécialité non trouvée' });
            }
            res.status(200).json(specialite);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Supprimer une spécialité avec niveau et filière
    async deleteSpecialite(req, res) {
        try {
            const specialite = await SpecialiteModel.deleteSpecialite(req.params.id);
            if (!specialite) {
                return res.status(404).json({ message: 'Spécialité non trouvée' });
            }
            res.status(200).json({ message: 'Spécialité supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getSpecialitesByFiliere(req, res) {
        try {
            const { filiereId } = req.params; // Récupérer l'ID de la filière depuis les paramètres
            const specialites = await SpecialiteModel.getSpecialitesByFiliere(filiereId); // Récupérer les spécialités liées à la filière
            
            if (specialites.length === 0) {
                return res.status(404).json({ message: 'Aucune spécialité trouvée pour cette filière' });
            }
            
            res.status(200).json(specialites); // Retourner les spécialités
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

        async getProgrammesByNiveau(req, res) {
            const { niveauId } = req.params;
    
            try {
                const programmes = await specialiteModel.getProgrammesByNiveau(niveauId);
    
                if (programmes.message) {
                    return res.status(404).json({ message: programmes.message });
                }
    
                return res.status(200).json(programmes);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Erreur interne du serveur." });
            }
        }
    
    
}

module.exports = new SpecialiteController();
