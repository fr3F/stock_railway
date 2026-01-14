const express = require('express');
const cors = require('cors');
const sequelize = require('./app/config/bd_config'); // Sequelize config
const defineAssociations = require('./app/models/associations'); // Associations
require('./app/models/__init__'); // Initialiser tous les modèles

// Importation des routes
const produitRoutes = require('./app/routes/produit.routes');
const depotRoutes = require('./app/routes/depot.routes');
const mouvementRoutes = require('./app/routes/mouvement.routes');
const utilisateurRoutes = require('./app/routes/utilisateur.routes');
const stockRoutes = require('./app/routes/stock.routes');
const authRoutes = require('./app/routes/auth.routes');
const emplacementRoutes = require('./app/routes/emplacement.routes');

const app = express();

// ✅ Middleware pour parser les JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Configuration CORS (uniquement ici)
const corsOptions = {
  origin: '*',
  credentials: true
};
app.use(cors(corsOptions));

// ✅ Gérer correctement les requêtes OPTIONS
app.options('*', cors(corsOptions));

// ❌ Supprimer le middleware CORS manuel — il entre en conflit et déclenche l'erreur
// app.use((req, res, next) => { ... }) ← À NE PAS REMETTRE

// Définir les relations Sequelize
defineAssociations();

// ✅ Utiliser les routes API
app.use('/api', produitRoutes);
app.use('/api', depotRoutes);
app.use('/api', mouvementRoutes);
app.use('/api', utilisateurRoutes);
app.use('/api', stockRoutes);
app.use('/api', authRoutes);
app.use('/api', emplacementRoutes);

// ✅ Fichiers statiques
app.use('/fichier', express.static(__dirname + '/app/uploads/'));

// ✅ Démarrer le serveur
const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Base de données synchronisée");

    app.listen(8080, () => {
      console.log("🚀 Serveur démarré sur http://localhost:8080");
    });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion à la base :", error);
  }
};

startServer();
