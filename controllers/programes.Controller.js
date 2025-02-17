const ProgrammeModel = require('../models/programes.model');

class ProgrammeController {
    async createProgramme(req, res) {
        try {
            const programme = await ProgrammeModel.createProgramme(req.body);
            res.status(201).json(programme);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Récupérer tous les programmes
    async getAllProgrammes(req, res) {
        try {
            const programmes = await ProgrammeModel.getAllProgrammes();
            res.status(200).json(programmes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Récupérer les programmes d'une spécialité
    async getProgrammesBySpecialite(req, res) {
        try {
            const { specialiteId } = req.params;
            const programmes = await ProgrammeModel.getProgrammesBySpecialite(specialiteId);
            
            if (programmes.length === 0) {
                return res.status(404).json({ message: 'Aucun programme trouvé pour cette spécialité' });
            }

            res.status(200).json(programmes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Modifier un programme
    async updateProgramme(req, res) {
        try {
            const programme = await ProgrammeModel.updateProgramme(req.params.id, req.body);
            if (!programme) {
                return res.status(404).json({ message: 'Programme non trouvé' });
            }
            res.status(200).json(programme);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Désactiver un programme
    async deactivateProgramme(req, res) {
        try {
            const programme = await ProgrammeModel.deactivateProgramme(req.params.id);
            if (!programme) {
                return res.status(404).json({ message: 'Programme non trouvé' });
            }
            res.status(200).json({ message: 'Programme désactivé avec succès' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ProgrammeController();
