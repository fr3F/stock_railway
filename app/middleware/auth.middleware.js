const jwt = require('jsonwebtoken');

// Map pour stocker les tokens avec leur contexte
const tokenContexts = new Map();

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'Token manquant' });
  }
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).json({ error: 'JWT_SECRET non configuré' });
    }
  try {

    const decoded = jwt.verify(token, jwtSecret);
    
    // Vérifier IP + User-Agent
    const currentContext = `${req.ip}-${req.headers['user-agent']}`;
    const savedContext = tokenContexts.get(token);
    
    if (savedContext && savedContext !== currentContext) {
      return res.status(401).json({ error: 'Token utilisé depuis un autre appareil' });
    }
    
    tokenContexts.set(token, currentContext);
    
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// Sauvegarder le contexte au login
exports.saveTokenContext = (token, req) => {
  const context = `${req.ip}-${req.headers['user-agent']}`;
  tokenContexts.set(token, context);
};