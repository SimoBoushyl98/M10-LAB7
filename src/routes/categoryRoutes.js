// src/routes/categoryRoutes.js : mêmes règles que les produits
import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { authorize } from '../middleware/auth.js';
import { categoryRules, idRule, handleValidation } from '../middleware/validators.js';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', idRule, handleValidation, categoryController.getOne);

router.post('/', authorize('ADMIN'), categoryRules, handleValidation, categoryController.create);
router.put('/:id', authorize('ADMIN'), idRule, categoryRules, handleValidation, categoryController.update);
router.delete('/:id', authorize('ADMIN'), idRule, handleValidation, categoryController.remove);

export default router;
