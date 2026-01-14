const express = require('express');
const router = express.Router();

const produitRoutes = require('./produit.routes');
const depotRoutes = require('./depot.routes');
const mouvementRoutes = require('./mouvement.routes');
const UtilisateurRoutes = require('./utilisateur.routes');
const StockRoutes = require('./stock.routes');
const authRoutes = require('./auth.routes');
const emplacementRoutes = require('./emplacement.routes');

// Routes
router.use('/api',produitRoutes);
router.use('/api',depotRoutes);
router.use('/api',mouvementRoutes);
router.use('/api',UtilisateurRoutes);
router.use('/api',StockRoutes);
router.use('/api',authRoutes);
router.use('/api',emplacementRoutes);

module.exports = router;