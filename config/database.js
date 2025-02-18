const { Pool } = require('pg');

// Configuration de la base de données avec les variables d'environnement
const password = String(process.env.DB_PASSWORD).trim();

const dbConfig = {
    user: process.env.DB_USER,        // Utilisation des variables d'environnement pour plus de sécurité
    password: password,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,   // Utilise ici DB_NAME au lieu de DB_DATABASE
};


// Création d'une nouvelle instance de Pool pour PostgreSQL
const pool = new Pool(dbConfig);

// Connexion à la base de données
pool.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to the database:', err));

module.exports = pool;
