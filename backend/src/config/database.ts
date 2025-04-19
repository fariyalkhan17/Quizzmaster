import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Determine if we should use connection string or individual parameters
const useConnectionString = process.env.DATABASE_URL ? true : false;

let sequelize: Sequelize;

if (useConnectionString) {
  // Use connection string if provided (for Heroku, etc.)
  sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Use individual connection parameters
  sequelize = new Sequelize(
    process.env.DB_NAME || 'quizmaster',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '', // Try empty password
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      retry: {
        max: 3
      }
    }
  );
}

export default sequelize; 