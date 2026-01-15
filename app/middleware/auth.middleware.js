const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token manquant' });
  const jwt_secret = process.env.JWT_SECRET;
  if (!jwt_secret) return res.status(500).json({ error: 'JWT_SECRET non configuré' });
  try {
    const decoded = jwt.verify(token, jwt_secret);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};