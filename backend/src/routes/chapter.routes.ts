import express, { RequestHandler } from 'express';
import * as chapterController from '../controllers/chapter.controller';
import { verifyToken as authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', chapterController.getAllChapters as unknown as RequestHandler);
router.get('/subject/:subjectId', chapterController.getChaptersBySubject as unknown as RequestHandler);
router.get('/:id', chapterController.getChapterById as unknown as RequestHandler);

// Admin only routes
router.post('/', authenticate, isAdmin, chapterController.createChapter as unknown as RequestHandler);
router.put('/:id', authenticate, isAdmin, chapterController.updateChapter as unknown as RequestHandler);
router.delete('/:id', authenticate, isAdmin, chapterController.deleteChapter as unknown as RequestHandler);

export default router; 