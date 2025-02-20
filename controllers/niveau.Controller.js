const NiveauModel = require('../models/niveau.model');

class NiveauController {
    // Créer un niveau
    async createNiveau(req, res) {
        try {
            const niveau = await NiveauModel.createNiveau(req.body);
            res.status(201).json(niveau);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Récupérer tous les niveaux
    async getAllNiveauxByFiliere(req, res) {
        const { filiere_id } = req.params;

        try {
            const niveaux = await NiveauModel.getAllByFiliere(filiere_id);
            return res.status(200).json({
                success: true,
                niveaux
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Une erreur est survenue.",
                error: error.message
            });
        }
    }

    // Récupérer un niveau par ID
    async getNiveauById(req, res) {
        try {
            const niveau = await NiveauModel.getNiveauById(req.params.id);
            if (!niveau) {
                return res.status(404).json({ message: 'Niveau non trouvé' });
            }
            res.status(200).json(niveau);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Mettre à jour un niveau
    async updateNiveau(req, res) {
        try {
            const niveau = await NiveauModel.updateNiveau(req.params.id, req.body);
            if (!niveau) {
                return res.status(404).json({ message: 'Niveau non trouvé' });
            }
            res.status(200).json(niveau);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Supprimer un niveau
    async deleteNiveau(req, res) {
        try {
            const niveau = await NiveauModel.deleteNiveau(req.params.id);
            if (!niveau) {
                return res.status(404).json({ message: 'Niveau non trouvé' });
            }
            res.status(200).json({ message: 'Niveau supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllNiveauxGroupedByFiliere(req, res) {
        try {
            const niveaux = await NiveauModel.getAllNiveauxWithFiliere();

            // Grouper les niveaux par filière
            const groupedByFiliere = niveaux.reduce((acc, niveau) => {
                const filiereNom = niveau.filiere_nom;

                // Si la filière n'existe pas encore dans l'objet, l'ajouter
                if (!acc[filiereNom]) {
                    acc[filiereNom] = {
                        filiere_id: niveau.filiere_id,
                        niveaux: []
                    };
                }

                // Ajouter le niveau à la filière correspondante
                acc[filiereNom].niveaux.push({
                    id: niveau.id,
                    nom: niveau.niveau_nom,
                    description: niveau.description
                });

                return acc;
            }, {});

            return res.status(200).json({
                success: true,
                data: groupedByFiliere
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Une erreur est survenue.",
                error: error.message
            });
        }
    }
}

module.exports = new NiveauController();
