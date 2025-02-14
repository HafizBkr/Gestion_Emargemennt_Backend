const jwt = require('jsonwebtoken');

const authenticateAdmin = (requiredRole = 'admin') => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];  // Get token from Authorization header

        if (!token) {
            return res.status(403).json({ error: 'Accès refusé, token manquant' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Token invalide' });
            }

            if (decoded.role !== requiredRole) {
                return res.status(403).json({ error: 'Accès interdit, vous n\'êtes pas un administrateur' });
            }

            req.admin = decoded;  // Attach the decoded admin object to the request
            next();
        });
    };
};


module.exports = authenticateAdmin;
