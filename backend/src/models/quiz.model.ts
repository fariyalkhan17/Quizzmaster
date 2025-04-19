import { DataTypes, Sequelize } from 'sequelize';
import { QuizInstance } from './interfaces';

export default (sequelize: Sequelize) => {
  const Quiz = sequelize.define<QuizInstance>(
    'Quiz', 
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      chapter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'chapters',
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date_of_quiz: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      time_duration: {
        type: DataTypes.STRING, // Format: HH:MM
        allowNull: false
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, 
    {
      timestamps: true,
      tableName: 'quizzes'
    }
  );

  return Quiz;
};