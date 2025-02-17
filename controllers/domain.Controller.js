const domaineModel = require("../models/domain.model");

// 🔹 Créer un domaine
async function creerDomaine(req, res) {
    const { nom } = req.body;
    if (!nom) {
        return res.status(400).json({ error: "Le nom du domaine est requis." });
    }

    try {
        const domaine = await domaineModel.creerDomaine(nom);
        res.status(201).json(domaine);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la création du domaine: ${error.message}` });
    }
}

// 🔹 Récupérer tous les domaines
async function getAllDomaines(req, res) {
    try {
        const domaines = await domaineModel.getAllDomaines();
        res.status(200).json({ domaines });
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération des domaines: ${error.message}` });
    }
}

// 🔹 Récupérer un domaine par ID
async function getDomaineById(req, res) {
    const { id } = req.params;
    try {
        const domaine = await domaineModel.getDomaineById(id);
        res.status(200).json(domaine);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

// 🔹 Mettre à jour un domaine
async function updateDomaine(req, res) {
    const { id } = req.params;
    const { nom } = req.body;

    if (!nom) {
        return res.status(400).json({ error: "Le nom du domaine est requis." });
    }

    try {
        const domaine = await domaineModel.updateDomaine(id, nom);
        res.status(200).json(domaine);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

// 🔹 Supprimer un domaine
async function deleteDomaine(req, res) {
    const { id } = req.params;
    try {
        const result = await domaineModel.deleteDomaine(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

module.exports = {
    creerDomaine,
    getAllDomaines,
    getDomaineById,
    updateDomaine,
    deleteDomaine
};
