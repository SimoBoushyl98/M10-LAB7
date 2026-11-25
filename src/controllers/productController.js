// src/controllers/productController.js
// Avec Express 5, une erreur dans une fonction async est envoyée automatiquement
// au middleware d'erreur : pas besoin de try/catch dans chaque fonction.
import * as productService from '../services/productService.js';

export const getAll = async (req, res) => {
  res.json(await productService.listProducts());
};

export const getOne = async (req, res) => {
  res.json(await productService.getProduct(req.params.id));
};

export const create = async (req, res) => {
  res.status(201).json(await productService.createProduct(req.body));
};

export const update = async (req, res) => {
  res.json(await productService.updateProduct(req.params.id, req.body));
};

export const remove = async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(204).send();
};

export const search = async (req, res) => {
  res.json(await productService.searchProducts(req.query));
};
