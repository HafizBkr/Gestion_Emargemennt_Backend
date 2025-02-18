// Importation de Twilio et chargement des variables d'environnement
const twilio = require('twilio');
require('dotenv').config();

// Initialisation du client Twilio avec les variables d'environnement
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,   // Assurez-vous que ces variables sont bien définies dans votre fichier .env
  process.env.TWILIO_AUTH_TOKEN
);

// Fonction pour envoyer un rappel à un professeur via WhatsApp
const sendProfessorReminder = async (professorPhone, date, heure_debut, heure_fin, programme, niveau) => {
  try {
      // Vérification que toutes les données nécessaires sont présentes
      const { course_name, filiere, specialite } = programme;

      if (!professorPhone || !date || !heure_debut || !heure_fin || !course_name || !filiere || !specialite || !niveau) {
          throw new Error('Tous les paramètres (professorPhone, date, heure_debut, heure_fin, course_name, filiere, specialite, niveau) doivent être fournis.');
      }

      // Construction du message
      const message = `
          📢 Rappel de cours :
          - 📖 Cours : ${course_name}
          - 🎓 Filière : ${filiere}
          - 🏛️ Spécialité : ${specialite}
          - 📚 Niveau : ${niveau.nom}
          - 📅 Date : ${date}
          - ⏰ Heure de début : ${heure_debut}
          - ⏰ Heure de fin : ${heure_fin}
          
          Merci de bien vouloir être présent à l'heure prévue.
          En cas de modification, veuillez nous en informer.  
          
          📌 L'administration.
      `;

      // Envoi du message via Twilio
      const response = await client.messages.create({
          body: message,
          from: 'whatsapp:+14155238886',
          to: `whatsapp:${professorPhone}`
      });

      console.log('Rappel envoyé avec succès:', response.sid);
      return response;
  } catch (error) {
      console.error('Erreur lors de l\'envoi du rappel:', error.message);
      throw new Error('Erreur lors de l\'envoi du rappel: ' + error.message);
  }
};

module.exports = { sendProfessorReminder };