// src/middleware/auth.js
// authenticate : vérifie le JWT (étape 11)
// authorize    : vérifie le rôle (étape 12)
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // token mal formé, signature fausse ou expiré -> 401 (l'utilisateur n'est pas authentifié)
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // On vérifie que le compte existe toujours (ex. compte supprimé avec DELETE /api/auth/me)
  // et on prend le rôle actuel en base plutôt que celui du token
  const [users] = await pool.execute('SELECT id, role FROM users WHERE id = ?', [decoded.id]);
  if (users.length === 0) {
    return res.status(401).json({ error: 'User no longer exists' });
  }

  req.user = { ...decoded, role: users[0].role }; // { id, role, iat, exp }
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }

    next();
  };
};
