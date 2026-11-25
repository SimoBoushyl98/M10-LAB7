// src/controllers/categoryController.js
import * as categoryService from '../services/categoryService.js';

export const getAll = async (req, res) => {
  res.json(await categoryService.listCategories());
};

export const getOne = async (req, res) => {
  res.json(await categoryService.getCategory(req.params.id));
};

export const create = async (req, res) => {
  res.status(201).json(await categoryService.createCategory(req.body));
};

export const update = async (req, res) => {
  res.json(await categoryService.updateCategory(req.params.id, req.body));
};

export const remove = async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(204).send();
};
