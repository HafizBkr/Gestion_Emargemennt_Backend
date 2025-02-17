// Charge les variables d'environnement
require('dotenv').config();

const nodemailer = require('nodemailer');

// Créez un transporteur SMTP avec les paramètres de votre fichier .env
const transporter = nodemailer.createTransport({
    service: 'gmail', // Vous pouvez changer cela si vous utilisez un autre fournisseur
    auth: {
        user: process.env.GMAIL_USER,  // Utilisation de la variable d'environnement
        pass: process.env.GMAIL_PASS,  // Utilisation de la variable d'environnement
    },
});

// Fonction pour envoyer un email
const sendEmail = async (to, subject, text) => {
    try {
        // Vérifie que l'email de l'expéditeur est bien défini
        if (!process.env.GMAIL_USER) {
            throw new Error('L\'adresse e-mail de l\'expéditeur est manquante.');
        }

        const mailOptions = {
            from: process.env.GMAIL_USER,  // Utilisation de la variable d'environnement
            to: to,
            subject: subject,
            text: text,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
    }
};

module.exports = { sendEmail };
