import express, { RequestHandler } from 'express';
import * as userController from '../controllers/user.controller';
import { verifyToken as authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// User profile routes
router.get('/profile', authenticate, userController.getProfile as unknown as RequestHandler);
router.put('/profile', authenticate, userController.updateProfile as unknown as RequestHandler);

// Admin routes
router.get('/', authenticate, isAdmin, userController.getAllUsers as unknown as RequestHandler);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser as unknown as RequestHandler);

export default router; 