import express, { RequestHandler } from 'express';
import * as quizController from '../controllers/quiz.controller';
import { verifyToken as authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', quizController.getAllQuizzes as unknown as RequestHandler);
router.get('/chapter/:chapterId', quizController.getQuizzesByChapter as unknown as RequestHandler);
router.get('/:id', quizController.getQuizById as unknown as RequestHandler);

// Admin only routes
router.post('/', authenticate, isAdmin, quizController.createQuiz as unknown as RequestHandler);
router.put('/:id', authenticate, isAdmin, quizController.updateQuiz as unknown as RequestHandler);
router.delete('/:id', authenticate, isAdmin, quizController.deleteQuiz as unknown as RequestHandler);

export default router; 