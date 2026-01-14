// Importer tous les modèles Sequelize
const Produit = require('./produits');
const Depot = require('./depot');
const Mouvement = require('./mouvement');
const Utilisateur = require('./utilisateur');
const Stock = require('./stock');
const Emplacement = require('./emplacement');

// Exporter tous les modèles pour les utiliser dans d'autres fichiers
module.exports = {
    Produit,
    Depot,  
    Mouvement,
    Utilisateur,
    Stock,
    Emplacement
};
