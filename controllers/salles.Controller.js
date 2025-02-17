const SalleModel = require('../models/salles.model');

class SalleController {
  // Créer une salle
  async createSalle(req, res) {
    try {
      const salle = await SalleModel.createSalle(req.body);
      res.status(201).json(salle);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Récupérer toutes les salles
  async getAllSalles(req, res) {
    try {
      const salles = await SalleModel.getAllSalles();
      res.status(200).json(salles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Récupérer une salle par ID
  async getSalleById(req, res) {
    try {
      const salle = await SalleModel.getSalleById(req.params.id);
      if (!salle) {
        return res.status(404).json({ message: 'Salle non trouvée' });
      }
      res.status(200).json(salle);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Mettre à jour une salle
  async updateSalle(req, res) {
    try {
      const salle = await SalleModel.updateSalle(req.params.id, req.body);
      if (!salle) {
        return res.status(404).json({ message: 'Salle non trouvée' });
      }
      res.status(200).json(salle);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Supprimer une salle
  async deleteSalle(req, res) {
    try {
      const salle = await SalleModel.deleteSalle(req.params.id);
      if (!salle) {
        return res.status(404).json({ message: 'Salle non trouvée' });
      }
      res.status(200).json({ message: 'Salle supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new SalleController();
