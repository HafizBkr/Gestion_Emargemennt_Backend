const filiereModel = require('../models/fillieres.model');

// Créer une filière
async function createFiliere(req, res) {
    const { nom, code, departement_id, description } = req.body;

    try {
        const filiere = await filiereModel.createFiliere(nom, code, departement_id, description);
        res.status(201).json({ filiere });
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la création de la filière : ${error.message}` });
    }
}

// Mettre à jour une filière
async function updateFiliere(req, res) {
    const { id } = req.params;
    const { nom, code, departement_id, description } = req.body;

    try {
        const filiere = await filiereModel.updateFiliere(id, nom, code, departement_id, description);
        if (!filiere) {
            return res.status(404).json({ error: 'Filière non trouvée' });
        }
        res.status(200).json({ filiere });
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la mise à jour de la filière : ${error.message}` });
    }
}

// Récupérer une filière par ID
async function getFiliereById(req, res) {
    const { id } = req.params;

    try {
        const filiere = await filiereModel.getFiliereById(id);
        if (!filiere) {
            return res.status(404).json({ error: 'Filière non trouvée' });
        }
        res.status(200).json({ filiere });
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération de la filière : ${error.message}` });
    }
}

// Désactiver une filière
async function deactivateFiliere(req, res) {
    const { id } = req.params;

    try {
        const filiere = await filiereModel.deactivateFiliere(id);
        if (!filiere) {
            return res.status(404).json({ error: 'Filière non trouvée' });
        }
        res.status(200).json({ filiere });
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la désactivation de la filière : ${error.message}` });
    }
}

// Récupérer toutes les filières
async function getAllFilieres(req, res) {
    try {
        const filieres = await filiereModel.getAllFilieres();
        res.status(200).json({ filieres });
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération des filières : ${error.message}` });
    }
}

module.exports = {
    createFiliere,
    updateFiliere,
    getFiliereById,
    deactivateFiliere,
    getAllFilieres
};
