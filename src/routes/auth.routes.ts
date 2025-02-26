import express from 'express';
import authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateLogin, validateRegister } from '../middleware/validation.middleware';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login - Login a user
router.post('/login', validateLogin, authController.login);

// GET /api/auth/me - Get current user information
router.get('/me', authMiddleware, authController.getMe);

export default router;