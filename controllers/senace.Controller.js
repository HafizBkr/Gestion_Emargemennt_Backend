const SeanceModel = require('../models/seance.model');
const { sendEmail } = require('../services/emaiService');
const { sendProfessorReminder } = require('../services/whatsappService');
const  ProfesseurModel  = require('../models/professeurs.model');
const  ProgrammeModel  = require('../models/programes.model');
const SalleModel = require('../models/salles.model');

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

  // controllers/seanceController.js

// Fonction de création de séance
static async createSeance(req, res) {
    try {
        const { programme_id, salle_id, professeur_id, date, heure_debut, heure_fin, statut } = req.body;

        // 1. Vérifier si la séance existe déjà
        const existingSeance = await SeanceModel.findSeance({
            programme_id,
            salle_id,
            professeur_id,
            date,
            heure_debut,
            heure_fin
        });

        if (existingSeance) {
            return res.status(400).json({ error: "Une séance avec ces informations existe déjà." });
        }

        // 2. Récupérer les informations du professeur
        const professeur = await ProfesseurModel.getProfesseurById(professeur_id);
        if (!professeur) {
            return res.status(404).json({ error: "Professeur non trouvé" });
        }

        // 3. Récupérer les informations du programme
        const programme = await ProgrammeModel.getProgrammeById(programme_id);
        if (!programme) {
            return res.status(404).json({ error: "Programme non trouvé" });
        }

        // 4. Récupérer les informations de la salle
        const salle = await SalleModel.getSalleById(salle_id);
        if (!salle) {
            return res.status(404).json({ error: "Salle non trouvée" });
        }

        // 5. Créer la séance
        const seance = await SeanceModel.createSeance({
            programme_id,
            programme_nom: programme.course_name,
            programme_filiere: programme.filiere,
            programme_specialite: programme.specialite,
            salle_id,
            salle_nom: salle.nom,  // Utilisation de salle.nom après récupération
            professeur_id,
            date,
            heure_debut,
            heure_fin,
            statut
        });

        // 6. Envoyer un rappel via WhatsApp
        await sendProfessorReminder(
            professeur.telephone,  // Professeur téléphone
            date,                   // Date
            heure_debut,            // Heure de début
            heure_fin,              // Heure de fin
            programme               // Passer l'objet programme complet
        );

        // 7. Structurer et envoyer un email de confirmation
        const emailSubject = `Nouvelle séance créée : ${programme.course_name} - ${programme.filiere}`;
        const emailText = `
            Bonjour  ${professeur.nom},

            Une nouvelle séance a été ajoutée à votre emploi du temps pour le programme ${programme.course_name} dans la filière ${programme.filiere}.

            Informations de la séance :
            -------------------------------------
            Programme : ${programme.course_name}
            Filière : ${programme.filiere}
            Spécialité : ${programme.specialite}
            Salle : ${salle.nom}
            Date : ${date}
            Heure de début : ${heure_debut}
            Heure de fin : ${heure_fin}
            Statut : ${statut}

            Merci de bien vouloir vérifier et nous informer si des modifications sont nécessaires.

            Cordialement,
            L'équipe de gestion des séances
        `;

        // Envoi de l'email
        await sendEmail(professeur.email, emailSubject, emailText);

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
