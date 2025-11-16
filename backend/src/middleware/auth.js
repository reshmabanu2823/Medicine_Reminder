const jwt = require('jsonwebtoken');
const { db } = require('../db');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.replace('Bearer ', '');
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = db.prepare('SELECT id,name,email,reminder_method FROM users WHERE id = ?').get(data.id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { requireAuth };
