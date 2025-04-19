import { DataTypes, Sequelize } from 'sequelize';
import { ScoreInstance } from './interfaces';

export default (sequelize: Sequelize) => {
  const Score = sequelize.define<ScoreInstance>(
    'Score', 
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      time_stamp_of_attempt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      total_questions: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total_scored: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      time_taken: {
        type: DataTypes.STRING, // Format: HH:MM:SS
        allowNull: true
      }
    }, 
    {
      timestamps: true,
      tableName: 'scores'
    }
  );

  return Score;
}; 