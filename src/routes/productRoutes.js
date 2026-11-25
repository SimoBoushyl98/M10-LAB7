// src/routes/productRoutes.js
// authenticate est déjà appliqué dans app.js : ici on gère seulement les rôles (étape 15)
import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import { authorize } from '../middleware/auth.js';
import { productRules, idRule, searchRules, handleValidation } from '../middleware/validators.js';

const router = Router();

// Lecture : tout utilisateur connecté (USER ou ADMIN)
router.get('/search', searchRules, handleValidation, productController.search);
router.get('/', productController.getAll);
router.get('/:id', idRule, handleValidation, productController.getOne);

// Écriture : ADMIN uniquement
router.post('/', authorize('ADMIN'), productRules, handleValidation, productController.create);
router.put('/:id', authorize('ADMIN'), idRule, productRules, handleValidation, productController.update);
router.delete('/:id', authorize('ADMIN'), idRule, handleValidation, productController.remove);

export default router;
