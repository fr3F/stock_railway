const express = require('express');
const router = express.Router();
const StockController = require('../controller/stockController');
const { verifyToken } = require('../middleware/auth.middleware');

router.use(verifyToken);
router.post('/stock',StockController.creerStock)
router.get('/stock',StockController.listeStock)
router.delete('/stock/:id_st',StockController.supprimerStock)
router.put('/stock/:id_st',StockController.modificationStock)
router.get('/stock/:id_st',StockController.getIdStock)

module.exports = router