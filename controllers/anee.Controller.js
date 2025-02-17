const AnneeScolaireModel = require('../models/annee.model');

class AnneeScolaireController {
  // Récupérer toutes les années scolaires
  static async getAll(req, res) {
    try {
      const annees = await AnneeScolaireModel.getAll();
      res.status(200).json(annees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer l'année scolaire active
  static async getActive(req, res) {
    try {
      const anneeActive = await AnneeScolaireModel.getActive();
      if (!anneeActive) {
        return res.status(404).json({ error: 'Aucune année scolaire active trouvée' });
      }
      res.status(200).json(anneeActive);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Créer une nouvelle année scolaire
  static async create(req, res) {
    const { start_date, end_date, is_active } = req.body;
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'Les dates de début et de fin sont obligatoires' });
    }

    try {
      const anneeScolaire = await AnneeScolaireModel.create({ start_date, end_date, is_active });
      res.status(201).json(anneeScolaire);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Mettre à jour une année scolaire
  static async update(req, res) {
    const { id } = req.params;
    const { start_date, end_date, is_active } = req.body;

    try {
      const anneeScolaire = await AnneeScolaireModel.update(id, { start_date, end_date, is_active });
      res.status(200).json(anneeScolaire);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Désactiver une année scolaire
  static async deactivate(req, res) {
    const { id } = req.params;
    try {
      const anneeScolaire = await AnneeScolaireModel.deactivate(id);
      res.status(200).json({ message: 'Année scolaire désactivée', data: anneeScolaire });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AnneeScolaireController;
