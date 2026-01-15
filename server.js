const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const sequelize = require('./app/config/bd_config'); 
const defineAssociations = require('./app/models/associations');
require('./app/models/__init__');

const produitRoutes = require('./app/routes/produit.routes');
const depotRoutes = require('./app/routes/depot.routes');
const mouvementRoutes = require('./app/routes/mouvement.routes');
const utilisateurRoutes = require('./app/routes/utilisateur.routes');
const stockRoutes = require('./app/routes/stock.routes');
const authRoutes = require('./app/routes/auth.routes');
const emplacementRoutes = require('./app/routes/emplacement.routes');

const app = express();

console.log('=== Variables d\'environnement ===');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Chargé' : '❌ MANQUANT');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

app.use(helmet( ));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: 'https://gestion-stock-front-peach.vercel.app', credentials: true }));

defineAssociations();

app.use('/api', authRoutes);
app.use('/api', produitRoutes);
app.use('/api', depotRoutes);
app.use('/api', mouvementRoutes);
app.use('/api', utilisateurRoutes);
app.use('/api', stockRoutes);
app.use('/api', emplacementRoutes);
app.use(
  '/fichier',
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
  express.static(__dirname + '/app/uploads/')
);
sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => app.listen(process.env.PORT || 8080, () => console.log('🚀 OK')))
  .catch(console.error);