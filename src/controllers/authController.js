// src/controllers/authController.js
import pool from '../config/db.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateToken } from '../utils/token.js';

// Exercice 3 : on enregistre chaque tentative de connexion échouée
const logFailedLogin = async (email, ip, reason) => {
  await pool.execute(
    'INSERT INTO login_logs (email, ip, reason) VALUES (?, ?, ?)',
    [email, ip, reason]
  );
};

// POST /api/auth/register (étape 8)
// Le rôle n'est pas lu dans le body : un nouvel inscrit est toujours USER
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Vérifier si l'utilisateur existe déjà
  const [existing] = await pool.execute(
    'SELECT id FROM users WHERE email = ? OR username = ?', [email, username]
  );
  if (existing.length > 0) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await hashPassword(password);
  const [result] = await pool.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );

  res.status(201).json({ message: 'User created successfully', id: result.insertId });
};

// POST /api/auth/login (étape 9)
export const login = async (req, res) => {
  const { email, password } = req.body;
  const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

  // même message dans les deux cas : on ne dit pas si c'est l'email ou le mot de passe qui est faux
  if (users.length === 0) {
    await logFailedLogin(email, req.ip, 'UNKNOWN_EMAIL');
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = users[0];
  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    await logFailedLogin(email, req.ip, 'WRONG_PASSWORD');
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ token, role: user.role });
};

// GET /api/auth/me (étape 10)
export const getMe = async (req, res) => {
  const userId = req.user.id; // ajouté par le middleware authenticate

  const [users] = await pool.execute(
    'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (users.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(users[0]);
};

// POST /api/auth/refresh (exercice 1) : nouveau token à partir d'un token encore valide
export const refresh = async (req, res) => {
  const token = generateToken(req.user);
  res.json({ token, role: req.user.role });
};

// DELETE /api/auth/me (exercice 2) : l'utilisateur supprime son propre compte
export const deleteMe = async (req, res) => {
  await pool.execute('DELETE FROM users WHERE id = ?', [req.user.id]);
  res.status(204).send();
};

// GET /api/auth/login-logs (exercice 3) : réservé à l'ADMIN
export const getLoginLogs = async (req, res) => {
  const [logs] = await pool.query(
    'SELECT id, email, ip, reason, created_at FROM login_logs ORDER BY id DESC LIMIT 50'
  );
  res.json(logs);
};
