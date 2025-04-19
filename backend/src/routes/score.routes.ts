import express, { RequestHandler } from 'express';
import * as scoreController from '../controllers/score.controller';
import { verifyToken as authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// User routes
router.post('/submit', authenticate, scoreController.submitQuiz as unknown as RequestHandler);
router.get('/user', authenticate, scoreController.getUserScores as unknown as RequestHandler);
router.get('/user/stats', authenticate, scoreController.getUserStats as unknown as RequestHandler);

// Admin routes
router.get('/quiz/:quizId', authenticate, isAdmin, scoreController.getScoresByQuiz as unknown as RequestHandler);
router.get('/', authenticate, isAdmin, scoreController.getAllScores as unknown as RequestHandler);

export default router; 