// app.js
require('dotenv').config();
const express = require('express');
const adminRoutes = require('./routes/admin.routes');
const profRoutes=require('./routes/professeur.routes');
const departemnentRoutes=require('./routes/departement.routes');
const domaineRoutes=require('./routes/domain.routes');
const fillieresRoutes=require('./routes/fillieres.routes');
const niveauRoutes=require('./routes/niveau.routes');
const specialiteRoutes=require('./routes/specialite.routres');
const programeRoutes=require('./routes/programes.routes')
const sallesRoutes=require('./routes/salles.routes')
const anneeRoutes=require('./routes/anees.routes')
const seanceRoutes=require('./routes/seance.routes');

const pool = require('./config/database');

const app = express();

app.use(express.json());
app.use('/admin', adminRoutes ,domaineRoutes);
app.use('/user', profRoutes);
app.use('/admin/dep',departemnentRoutes);
app.use('/admin/fillieres', fillieresRoutes);
app.use('/admin/niveau', niveauRoutes);
app.use('/admin/specialite', specialiteRoutes);
app.use('/admin/programes', programeRoutes);
app.use('/admin/salles', sallesRoutes);
app.use('/admin/annee', anneeRoutes);
app.use('/admin/seance', seanceRoutes);

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ time: result.rows[0].now });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

module.exports = app;
