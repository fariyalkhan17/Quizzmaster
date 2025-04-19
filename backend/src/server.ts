import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models';
import { initializeAdmin } from './config/init.db';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import subjectRoutes from './routes/subject.routes';
import chapterRoutes from './routes/chapter.routes';
import quizRoutes from './routes/quiz.routes';
import questionRoutes from './routes/question.routes';
import scoreRoutes from './routes/score.routes';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/scores', scoreRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Quiz Master API' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database (in development)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
    
    // Initialize admin user
    await initializeAdmin();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.log('Server will continue to run without database functionality. API endpoints that require database access will not work.');
  }
}); 