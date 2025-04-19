const { Sequelize } = require('sequelize');
require('dotenv').config();

async function testConnection() {
  const sequelize = new Sequelize(
    process.env.DB_NAME || 'quizmaster',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      logging: console.log
    }
  );

  try {
    console.log('Testing database connection...');
    console.log('Connection details:');
    console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`Port: ${process.env.DB_PORT || '5432'}`);
    console.log(`Database: ${process.env.DB_NAME || 'quizmaster'}`);
    console.log(`User: ${process.env.DB_USER || 'postgres'}`);
    
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Try to query the database to ensure it's working
    const [results] = await sequelize.query('SELECT current_timestamp');
    console.log('Current database time:', results[0].current_timestamp);
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:');
    console.error(error.message);
    console.error('\nPlease check that:');
    console.error('1. PostgreSQL is installed and running');
    console.error('2. The database "quizmaster" exists');
    console.error('3. The username and password in .env are correct');
    console.error('4. PostgreSQL is listening on the specified port');
    
    process.exit(1);
  }
}

testConnection(); 