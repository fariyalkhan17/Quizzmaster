import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import subjectRoutes from './subject.routes';
import chapterRoutes from './chapter.routes';
import quizRoutes from './quiz.routes';
import questionRoutes from './question.routes';
import scoreRoutes from './score.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/subjects', subjectRoutes);
router.use('/chapters', chapterRoutes);
router.use('/quizzes', quizRoutes);
router.use('/questions', questionRoutes);
router.use('/scores', scoreRoutes);

export default router; 