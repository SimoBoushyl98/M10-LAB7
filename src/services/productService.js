// src/services/productService.js (repris du LAB 6)
import * as productRepo from '../repositories/productRepository.js';
import * as categoryRepo from '../repositories/categoryRepository.js';

export async function listProducts() {
  return await productRepo.getAll();
}

export async function getProduct(id) {
  const product = await productRepo.getById(id);
  if (!product) throw new Error('Product not found');
  return product;
}

export async function createProduct(data) {
  if (data.category_id) {
    const cat = await categoryRepo.getById(data.category_id);
    if (!cat) throw new Error('Invalid category_id');
  }
  return await productRepo.create(data);
}

export async function updateProduct(id, data) {
  const existing = await productRepo.getById(id);
  if (!existing) throw new Error('Product not found');
  if (data.category_id) {
    const cat = await categoryRepo.getById(data.category_id);
    if (!cat) throw new Error('Invalid category_id');
  }
  return await productRepo.update(id, data);
}

export async function deleteProduct(id) {
  const existing = await productRepo.getById(id);
  if (!existing) throw new Error('Product not found');
  await productRepo.remove(id);
}

export async function searchProducts(filters) {
  return await productRepo.search(filters);
}
