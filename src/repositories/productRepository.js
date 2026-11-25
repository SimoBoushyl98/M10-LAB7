// src/repositories/productRepository.js (repris du LAB 6)
import pool from '../config/db.js';

const SORT_COLUMNS = ['id', 'name', 'price', 'category_id'];

export async function getAll() {
  const [rows] = await pool.query('SELECT * FROM products');
  return rows;
}

export async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
}

export async function create(product) {
  const { name, price, category_id = null } = product;
  const [result] = await pool.execute(
    'INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)',
    [name, price, category_id]
  );
  return { id: result.insertId, name, price, category_id };
}

export async function update(id, product) {
  const { name, price, category_id = null } = product;
  await pool.execute(
    'UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?',
    [name, price, category_id, id]
  );
  return { id: Number(id), name, price, category_id };
}

export async function remove(id) {
  await pool.execute('DELETE FROM products WHERE id = ?', [id]);
}

export async function search({ name, minPrice, maxPrice, categoryId, limit = 10, offset = 0, sort = 'name', order = 'asc' }) {
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];
  if (name) { sql += ' AND name LIKE ?'; params.push(`%${name}%`); }
  if (minPrice) { sql += ' AND price >= ?'; params.push(minPrice); }
  if (maxPrice) { sql += ' AND price <= ?'; params.push(maxPrice); }
  if (categoryId) { sql += ' AND category_id = ?'; params.push(categoryId); }

  // liste blanche pour le tri (on ne peut pas utiliser ? pour un nom de colonne)
  const sortColumn = SORT_COLUMNS.includes(sort) ? sort : 'name';
  const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  sql += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  const [rows] = await pool.execute(sql, params);
  return rows;
}
