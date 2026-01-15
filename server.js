const express = require('express');
const cors = require('cors');
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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: true, credentials: true }));

defineAssociations();
app.get('/', (req, res) => { res.json({ message: 'Bienvenue API Backend'})});

app.use('/api', produitRoutes);
app.use('/api', depotRoutes);
app.use('/api', mouvementRoutes);
app.use('/api', utilisateurRoutes);
app.use('/api', stockRoutes);
app.use('/api', authRoutes);
app.use('/api', emplacementRoutes);
app.use('/fichier', express.static(__dirname + '/app/uploads/'));

app.use((err, req, res, next) => res.status(500).json({ error: err.message }));

sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(process.env.PORT || 8080, () => console.log('🚀 Serveur OK'));
  })
  .catch(err => console.error(err));