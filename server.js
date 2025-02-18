const app = require('./app');
const port = process.env.PORT || 10000; 


app.listen(port, '0.0.0.0', () => {  // Se lier à 0.0.0.0 pour accepter les connexions externes
    console.log(`Serveur lancé sur le port ${port}`);
  });