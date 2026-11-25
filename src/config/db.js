// src/config/db.js
// Pool de connexions MySQL (paramètres lus dans le fichier .env)
import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true // price renvoyé en nombre et pas en chaîne (vu au LAB 6)
});

export default pool;
