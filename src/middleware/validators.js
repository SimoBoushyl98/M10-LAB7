// src/middleware/validators.js
// Règles express-validator (auth du LAB 7 + produits/catégories du LAB 6)
import { body, param, query, validationResult } from 'express-validator';

// ---------- Auth (étape 13) ----------
export const registerValidation = [
  body('username').isLength({ min: 3 }).withMessage('Username too short'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password too weak')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// ---------- Produits / catégories (LAB 6) ----------
export const productRules = [
  body('name').isString().isLength({ min: 3 }).withMessage('Name must be at least 3 chars'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be positive').toFloat(),
  body('category_id').optional({ values: 'null' }).isInt({ gt: 0 }).withMessage('category_id must be a positive integer').toInt()
];

export const categoryRules = [
  body('name').isString().isLength({ min: 2 }).withMessage('Category name too short')
];

export const idRule = [
  param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer')
];

export const searchRules = [
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('categoryId').optional().isInt({ gt: 0 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
];

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
