// src/services/categoryService.js (repris du LAB 6)
import * as categoryRepo from '../repositories/categoryRepository.js';
import * as productRepo from '../repositories/productRepository.js';

export async function listCategories() {
  return await categoryRepo.getAll();
}

export async function getCategory(id) {
  const cat = await categoryRepo.getById(id);
  if (!cat) throw new Error('Category not found');
  return cat;
}

export async function createCategory(data) {
  return await categoryRepo.create(data);
}

export async function updateCategory(id, data) {
  const existing = await categoryRepo.getById(id);
  if (!existing) throw new Error('Category not found');
  return await categoryRepo.update(id, data);
}

export async function deleteCategory(id) {
  const existing = await categoryRepo.getById(id);
  if (!existing) throw new Error('Category not found');
  const products = await productRepo.getAll();
  const linked = products.filter(p => p.category_id === Number(id));
  if (linked.length) throw new Error('Cannot delete category with linked products');
  await categoryRepo.remove(id);
}
