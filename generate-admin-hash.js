const bcrypt = require('bcryptjs');

// Configuration de l'admin par défaut
const defaultAdmin = {
    email: 'admin@test.com',
    password: 'hayi'
};

// Génération du hash
const generateHash = async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(defaultAdmin.password, salt);
        
        // Afficher la requête SQL avec le hash
        console.log('Requête SQL pour insérer l\'admin par défaut :');
        console.log(`INSERT INTO admins (email, password) VALUES ('${defaultAdmin.email}', '${hash}');`);
        
        // Afficher les informations de connexion
        console.log('\nInformations de connexion:');
        console.log('Email:', defaultAdmin.email);
        console.log('Mot de passe (non hashé):', defaultAdmin.password);
        console.log('Mot de passe (hashé):', hash);
    } catch (error) {
        console.error('Erreur lors de la génération du hash:', error);
    }
};

// Exécuter la fonction
generateHash();