// Importation de Twilio et chargement des variables d'environnement
const twilio = require('twilio');
require('dotenv').config();

// Initialisation du client Twilio avec les variables d'environnement
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,   // Assurez-vous que ces variables sont bien définies dans votre fichier .env
  process.env.TWILIO_AUTH_TOKEN
);

// Fonction pour envoyer un rappel à un professeur via WhatsApp
const sendProfessorReminder = async (professorPhone, date, time) => {
  try {
    if (!professorPhone || !date || !time) {
      throw new Error('Tous les paramètres (professorPhone, date, time) doivent être fournis.');
    }

    const message = `Votre rendez-vous est prévu le ${date} à ${time}. Si vous devez le modifier, veuillez répondre et nous faire savoir.`;

    // Envoi du message via l'API Twilio
    const response = await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',  // Numéro WhatsApp Twilio (à ajuster si nécessaire)
      to: `whatsapp:${professorPhone}` // Numéro du professeur passé en paramètre
    });

    console.log('Rappel envoyé avec succès:', response.sid);
    return response;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du rappel:', error);
    throw error;
  }
};

module.exports = { sendProfessorReminder };
