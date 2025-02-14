// app.js
require('dotenv').config();
const express = require('express');
const adminRoutes = require('./routes/admin.routes');
const client = require('./config/database'); 
const pool = require('./config/database');

const app = express();

app.use(express.json());
app.use('/admin', adminRoutes);

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ time: result.rows[0].now });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Exporter l'application pour l'utiliser dans d'autres fichiers si nécessaire
module.exports = app;
