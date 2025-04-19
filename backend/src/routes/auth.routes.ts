import express, { RequestHandler } from 'express';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

// Authentication routes
router.post('/register', authController.register as unknown as RequestHandler);
router.post('/login', authController.login as unknown as RequestHandler);

export default router; 