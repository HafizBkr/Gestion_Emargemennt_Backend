const SeanceModel = require('../models/seance.model');
const { sendEmail } = require('../services/emaiService');
const { sendProfessorReminder } = require('../services/whatsappService');
const  ProfesseurModel  = require('../models/professeurs.model');

class SeanceController {
    // ➜ Obtenir toutes les séances
    static async getAllSeances(req, res) {
        try {
            const seances = await SeanceModel.getAllSeances();
            return res.json(seances);
        } catch (error) {
            console.error("Erreur lors de la récupération des séances:", error);
            return res.status(500).json({ error: `Erreur interne du serveur: ${error.message}` });
        }
    }

    // ➜ Obtenir une séance par ID
    static async getSeanceById(req, res) {
        try {
            const seance = await SeanceModel.getSeanceById(req.params.id);
            if (!seance) return res.status(404).json({ error: "Séance non trouvée" });
            return res.json(seance);
        } catch (error) {
            console.error("Erreur lors de la récupération de la séance:", error);
            return res.status(500).json({ error: `Erreur interne du serveur: ${error.message}` });
        }
    }

    // ➜ Créer une nouvelle séance
    static async createSeance(req, res) {
        try {
            const { programme_id, salle_id, professeur_id, date, heure_debut, heure_fin, statut } = req.body;

            // 1. Récupérer les informations du professeur à partir de l'ID
            const professeur = await ProfesseurModel.getProfesseurById(professeur_id);
            if (!professeur) {
                return res.status(404).json({ error: "Professeur non trouvé" });
            }

            // 2. Créer la séance
            const seance = await SeanceModel.createSeance({ programme_id, salle_id, professeur_id, date, heure_debut, heure_fin, statut });

            // 3. Envoyer un email de notification
            const subject = `Nouvelle séance programmée`;
            const emailText = `
                Bonjour ${professeur.nom},

                Une nouvelle séance a été programmée :
                - 📅 Date : ${date}
                - ⏰ Heure : ${heure_debut} - ${heure_fin}
                - Statut : ${statut}

                Merci de prendre en compte cette information.

                Cordialement,
                L'administration
            `;
            await sendEmail(professeur.email, subject, emailText);

            // 4. Envoyer un rappel via WhatsApp
            await sendProfessorReminder(professeur.telephone, date, heure_debut);

            return res.json({ message: 'Séance créée avec succès', seance });
        } catch (error) {
            console.error("Erreur lors de la création de la séance:", error);
            return res.status(500).json({ error: `Erreur interne du serveur: ${error.message}` });
        }
    }

    // ➜ Mettre à jour une séance
    static async updateSeance(req, res) {
        try {
            const { statut, date, heure_debut, heure_fin } = req.body;
            const seance = await SeanceModel.updateSeance(req.params.id, req.body);

            if (!seance) return res.status(404).json({ error: "Séance non trouvée" });

            if (statut && statut !== seance.statut) {
                const { professeur_email, professeur_nom, salle_nom, salle_capacite, programme_nom, programme_specialite } = seance;
                const subject = `📅 Mise à jour de séance`;
                const emailText = `
                    Bonjour ${professeur_nom},

                    La séance programmée a été mise à jour :
                    - 📅 Date : ${date}
                    - ⏰ Heure : ${heure_debut} - ${heure_fin}
                    - 📖 Filière : ${programme_nom} (${programme_specialite})
                    - 🏫 Salle : ${salle_nom} (Capacité : ${salle_capacite})
                    - Statut : ${statut}

                    Merci de prendre en compte cette modification.

                    Cordialement,
                    L'administration
                `;
                await sendEmail(professeur_email, subject, emailText);
                await sendProfessorReminder(professeur_email, `Votre séance programmée le ${date} à ${heure_debut} a été mise à jour. Statut : ${statut}`);
            }

            return res.json({ message: 'Séance mise à jour avec succès', seance });
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la séance:", error);
            return res.status(500).json({ error: `Erreur interne du serveur: ${error.message}` });
        }
    }

    // ➜ Supprimer une séance
    static async deleteSeance(req, res) {
        try {
            const seance = await SeanceModel.deleteSeance(req.params.id);
            if (!seance) return res.status(404).json({ error: "Séance non trouvée" });
            return res.json({ message: "Séance supprimée avec succès" });
        } catch (error) {
            console.error("Erreur lors de la suppression de la séance:", error);
            return res.status(500).json({ error: `Erreur interne du serveur: ${error.message}` });
        }
    }
}

module.exports = SeanceController;
