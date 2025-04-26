import express, { RequestHandler } from 'express';
import * as questionController from '../controllers/question.controller';
import { verifyToken as authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// Question routes
router.post('/', authenticate, isAdmin, questionController.createQuestion as unknown as RequestHandler);
router.get('/quiz/:quizId', authenticate, questionController.getQuestionsByQuiz as unknown as RequestHandler);
router.get('/quiz/:quizId/user', authenticate, questionController.getQuestionsByQuizForUser as unknown as RequestHandler);
router.get('/:id', authenticate, questionController.getQuestionById as unknown as RequestHandler);
router.put('/:id', authenticate, isAdmin, questionController.updateQuestion as unknown as RequestHandler);
router.delete('/:id', authenticate, isAdmin, questionController.deleteQuestion as unknown as RequestHandler);

export default router; 