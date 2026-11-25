// src/routes/authRoutes.js (étape 14)
import { Router } from 'express';
import { register, login, getMe, refresh, deleteMe, getLoginLogs } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { registerValidation, loginValidation, handleValidation } from '../middleware/validators.js';

const router = Router();

router.post('/register', registerValidation, handleValidation, register);
router.post('/login', loginValidation, handleValidation, login);
router.get('/me', authenticate, getMe);

// Exercices
router.post('/refresh', authenticate, refresh);
router.delete('/me', authenticate, deleteMe);
router.get('/login-logs', authenticate, authorize('ADMIN'), getLoginLogs);

export default router;
