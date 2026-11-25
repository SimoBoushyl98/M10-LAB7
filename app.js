// app.js - point d'entrée
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import { authenticate } from './src/middleware/auth.js';
import { errorHandler } from './src/middleware/errorHandler.js';

// Sans secret, impossible de signer les tokens : on arrête tout de suite
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing in .env');
  process.exit(1);
}

const app = express();

// CORS : seulement l'origine du front définie dans .env (étape 17)
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Product API - LAB 7 (JWT)' });
});

// Routes publiques + /me
app.use('/api/auth', authRoutes);

// Routes protégées : il faut un token valide pour tout ce qui suit
app.use('/api/products', authenticate, productRoutes);
app.use('/api/categories', authenticate, categoryRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

pool.getConnection()
  .then(connection => {
    console.log(`Connected to MySQL (${process.env.DB_NAME})`);
    connection.release();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to MySQL:', err.message);
    process.exit(1);
  });
