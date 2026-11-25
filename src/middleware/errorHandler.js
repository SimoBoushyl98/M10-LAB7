// src/middleware/errorHandler.js
// Middleware d'erreur global (étape 16), placé après toutes les routes dans app.js

export const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  // erreurs "métier" lancées par les services (repris du LAB 6)
  if (err.message.includes('not found')) {
    return res.status(404).json({ error: err.message });
  }
  if (err.message.startsWith('Invalid') || err.message.startsWith('Cannot')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};
