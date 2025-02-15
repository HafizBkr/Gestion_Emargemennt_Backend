const Departement = require("../models/departement.model");

exports.createDepartement = async (req, res) => {
    try {
        const { nom, code, responsableID } = req.body;
        
        // Insertion du département
        const departement = await Departement.insertDepartement(nom, code, responsableID);
        
        res.status(201).json(departement);
    } catch (error) {
        console.error("Erreur lors de la création du département : ", error);

        // Vérification d'erreur spécifique (par exemple, violer une contrainte unique ou autre)
        if (error.message && error.message.includes("unique")) {
            return res.status(400).json({ message: "Un département avec ce responsable existe déjà." });
        }

        res.status(500).json({ message: "Erreur lors de la création", error: error.message });
    }
};

exports.getAllDepartements = async (req, res) => {
    try {
        const departements = await Departement.getAllDepartements();
        res.json(departements);
    } catch (error) {
        console.error("Erreur lors de la récupération des départements : ", error);
        res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
    }
};

exports.getDepartementById = async (req, res) => {
    try {
        const departement = await Departement.getDepartementById(req.params.id);
        if (!departement) return res.status(404).json({ message: "Département non trouvé" });
        res.json(departement);
    } catch (error) {
        console.error("Erreur lors de la récupération du département : ", error);
        res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
    }
};

exports.updateDepartement = async (req, res) => {
    try {
        const { nom, code, responsableID } = req.body;
        const departement = await Departement.updateDepartement(req.params.id, nom, code, responsableID);
        
        // Vérification si le département n'a pas été trouvé
        if (!departement) return res.status(404).json({ message: "Département non trouvé" });

        res.json(departement);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du département : ", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
    }
};

exports.deleteDepartement = async (req, res) => {
    try {
        const result = await Departement.deleteDepartement(req.params.id);
        
        // Vérification du résultat pour s'assurer qu'une ligne a bien été supprimée
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Département non trouvé" });
        }

        res.json({ message: "Département supprimé" });
    } catch (error) {
        console.error("Erreur lors de la suppression du département : ", error);
        res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
    }
};


exports.toggleDepartement = async (req, res) => {
    try {
        const { actif } = req.body;
        await Departement.toggleDepartement(req.params.id, actif);
        res.json({ message: "Statut mis à jour" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut du département : ", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
    }
};
