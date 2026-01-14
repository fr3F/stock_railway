const express = require('express');
const cors = require('cors');
require('dotenv').config();
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

// ✅ Configuration CORS optimisée
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ✅ Route de santé (health check) pour Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ Route racine
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API Sodim Backend',
    version: '1.0.0',
    status: 'running'
  });
});

// ✅ Définir les relations Sequelize
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

// ✅ Gestion des routes non trouvées (404)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.path,
    method: req.method
  });
});

// ✅ Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Une erreur est survenue' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ✅ Démarrer le serveur avec gestion améliorée
const startServer = async () => {
  try {
    // 🔍 DEBUG : Afficher les variables de connexion
    console.log('🔍 Configuration de connexion:');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '****' : 'MANQUANT');
    
    // ✅ Test de connexion à la base de données
    await sequelize.authenticate();
    console.log("✅ Connexion à la base de données établie");

    // ✅ Synchronisation conditionnelle selon l'environnement
    const syncOptions = process.env.NODE_ENV === 'production' 
      ? { alter: false } 
      : { alter: true };
    
    await sequelize.sync(syncOptions);
    console.log("✅ Base de données synchronisée");

    // ✅ Port dynamique pour Railway
    const PORT = process.env.PORT || 8080;
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Base de données: ${process.env.DB_NAME || 'locale'}`);
    });

  } catch (error) {
    console.error("❌ Erreur fatale lors du démarrage:", error);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
};

// ✅ Gestion propre de l'arrêt du serveur
process.on('SIGTERM', async () => {
  console.log('⚠️ Signal SIGTERM reçu, fermeture gracieuse...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️ Signal SIGINT reçu, fermeture gracieuse...');
  await sequelize.close();
  process.exit(0);
});

// ✅ Démarrer l'application
startServer();