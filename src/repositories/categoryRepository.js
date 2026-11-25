// src/repositories/categoryRepository.js (repris du LAB 6)
import pool from '../config/db.js';

export async function getAll() {
  const [rows] = await pool.query('SELECT * FROM categories');
  return rows;
}

export async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0];
}

export async function create(category) {
  const [result] = await pool.execute('INSERT INTO categories (name) VALUES (?)', [category.name]);
  return { id: result.insertId, name: category.name };
}

export async function update(id, category) {
  await pool.execute('UPDATE categories SET name = ? WHERE id = ?', [category.name, id]);
  return { id: Number(id), name: category.name };
}

export async function remove(id) {
  await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
}
