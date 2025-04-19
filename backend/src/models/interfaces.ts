import { Model, Optional } from 'sequelize';

// User
export interface UserAttributes {
  id: number;
  username: string;
  password?: string;
  fullName: string;
  qualification?: string;
  dob?: Date;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

// Subject
export interface SubjectAttributes {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface SubjectInstance extends Model<SubjectAttributes, SubjectCreationAttributes>, SubjectAttributes {}

// Chapter
export interface ChapterAttributes {
  id: number;
  subject_id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChapterCreationAttributes extends Optional<ChapterAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ChapterInstance extends Model<ChapterAttributes, ChapterCreationAttributes>, ChapterAttributes {}

// Quiz
export interface QuizAttributes {
  id: number;
  chapter_id: number;
  name: string;
  date_of_quiz: Date;
  time_duration: string;
  remarks?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuizCreationAttributes extends Optional<QuizAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface QuizInstance extends Model<QuizAttributes, QuizCreationAttributes>, QuizAttributes {}

// Question
export interface QuestionAttributes {
  id: number;
  quiz_id: number;
  question_statement: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface QuestionInstance extends Model<QuestionAttributes, QuestionCreationAttributes>, QuestionAttributes {}

// Score
export interface ScoreAttributes {
  id: number;
  quiz_id: number;
  user_id: number;
  time_stamp_of_attempt: Date;
  total_questions: number;
  total_scored: number;
  time_taken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ScoreCreationAttributes extends Optional<ScoreAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ScoreInstance extends Model<ScoreAttributes, ScoreCreationAttributes>, ScoreAttributes {} 