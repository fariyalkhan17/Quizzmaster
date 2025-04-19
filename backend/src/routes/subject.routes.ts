import express, { RequestHandler } from 'express';
import * as subjectController from '../controllers/subject.controller';
import { verifyToken as authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', subjectController.getAllSubjects as unknown as RequestHandler);
router.get('/:id', subjectController.getSubjectById as unknown as RequestHandler);

// Admin only routes
router.post('/', authenticate, isAdmin, subjectController.createSubject as unknown as RequestHandler);
router.put('/:id', authenticate, isAdmin, subjectController.updateSubject as unknown as RequestHandler);
router.delete('/:id', authenticate, isAdmin, subjectController.deleteSubject as unknown as RequestHandler);

export default router; 