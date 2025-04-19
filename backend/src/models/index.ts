import { Sequelize } from 'sequelize';
import sequelize from '../config/database';

// Import model factories
import UserModel from './user.model';
import SubjectModel from './subject.model';
import ChapterModel from './chapter.model';
import QuizModel from './quiz.model';
import QuestionModel from './question.model';
import ScoreModel from './score.model';

// Initialize models
export const User = UserModel(sequelize);
export const Subject = SubjectModel(sequelize);
export const Chapter = ChapterModel(sequelize);
export const Quiz = QuizModel(sequelize);
export const Question = QuestionModel(sequelize);
export const Score = ScoreModel(sequelize);

// Define relationships
try {
  Subject.hasMany(Chapter, { foreignKey: 'subject_id', as: 'chapters' });
  Chapter.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

  Chapter.hasMany(Quiz, { foreignKey: 'chapter_id', as: 'quizzes' });
  Quiz.belongsTo(Chapter, { foreignKey: 'chapter_id', as: 'chapter' });

  Quiz.hasMany(Question, { foreignKey: 'quiz_id', as: 'questions' });
  Question.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

  User.hasMany(Score, { foreignKey: 'user_id', as: 'scores' });
  Score.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Quiz.hasMany(Score, { foreignKey: 'quiz_id', as: 'scores' });
  Score.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
} catch (error) {
  console.error('Error setting up database relationships:', error);
}

export { sequelize };

export default {
  sequelize,
  User,
  Subject,
  Chapter,
  Quiz,
  Question,
  Score
}; 