const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Récupère le token de l'en-tête Authorization

    if (!token) {
        return res.status(403).json({ error: 'Accès refusé, token manquant' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }

        req.admin = decoded;  // Ajoute l'objet admin décodé dans req.admin
        next();
    });
};

module.exports = { authenticateAdmin };
