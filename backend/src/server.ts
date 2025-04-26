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
import routes from './routes';

app.use('/api', routes);

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