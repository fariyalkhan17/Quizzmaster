import { DataTypes, Sequelize } from 'sequelize';
import { QuestionInstance } from './interfaces';

export default (sequelize: Sequelize) => {
  const Question = sequelize.define<QuestionInstance>(
    'Question', 
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'quizzes',
          key: 'id'
        }
      },
      question_statement: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      option1: {
        type: DataTypes.STRING,
        allowNull: false
      },
      option2: {
        type: DataTypes.STRING,
        allowNull: false
      },
      option3: {
        type: DataTypes.STRING,
        allowNull: false
      },
      option4: {
        type: DataTypes.STRING,
        allowNull: false
      },
      correct_option: {
        type: DataTypes.INTEGER, // 1, 2, 3, or 4
        allowNull: false
      }
    }, 
    {
      timestamps: true,
      tableName: 'questions'
    }
  );

  return Question;
}; 