const express = require('express');
const router = express.Router();
const utilisateurController = require('../controller/utilisateurController');
const { verifyToken } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.post('/utilisateur',utilisateurController.creerUtilisateur);
router.get('/utilisateur',utilisateurController.listeUtilisateur);
router.delete('/utilisateur/:id_ut',utilisateurController.supprimerUtilisateur);
router.put('/utilisateur/:id_ut',utilisateurController.modificationUtilisateur);
router.get('/utilisateur/:id_ut',utilisateurController.findUtilisateurById);

router.get('/user', (req, res) => {
  res.status(200).json({ message: 'Liste des utilisateurs' });
});
module.exports = router;