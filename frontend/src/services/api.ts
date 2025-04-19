import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_URL = 'http://localhost:5000/api';

// Types
export interface User {
  id: number;
  username: string;
  fullName: string;
  qualification?: string;
  dob?: string;
  role: 'admin' | 'user';
}

export interface Subject {
  id: number;
  name: string;
  description?: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: number;
  subject_id: number;
  name: string;
  description?: string;
  quizzes?: Quiz[];
  subject?: Subject;
}

export interface Quiz {
  id: number;
  chapter_id: number;
  title: string;
  description?: string;
  timeLimit: number;
  passingScore: number;
  name?: string;
  date_of_quiz?: string;
  time_duration?: string;
  remarks?: string;
  questions?: Question[];
  chapter?: Chapter;
}

export interface Question {
  id: number;
  quiz_id: number;
  text: string;
  question_statement?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correct_option?: number;
  quiz?: Quiz;
  options?: Option[];
}

export interface Option {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
}

export interface Score {
  id: number;
  quiz_id: number;
  user_id: number;
  time_stamp_of_attempt: string;
  total_questions: number;
  total_scored: number;
  time_taken?: string;
  quiz?: Quiz;
  user?: User;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserStats {
  totalQuizzes: number;
  totalQuestions: number;
  totalCorrect: number;
  averageScore: number;
}

// API Types
export interface RegisterData {
  username: string;
  password: string;
  fullName: string;
  qualification?: string;
  dob?: string;
}

export interface QuizSubmissionData {
  quiz_id: number;
  answers: QuizAnswer[];
  time_taken: string;
}

export interface QuizAnswer {
  question_id: number;
  selected_option: number;
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const login = (username: string, password: string): Promise<AxiosResponse<AuthResponse>> => {
  return api.post('/auth/login', { username, password });
};

export const register = (userData: RegisterData): Promise<AxiosResponse<{ message: string; user: User }>> => {
  return api.post('/auth/register', userData);
};

// User services
export const getUserProfile = (): Promise<AxiosResponse<User>> => {
  return api.get('/users/profile');
};

export const updateUserProfile = (userData: Partial<User>): Promise<AxiosResponse<{ message: string; user: User }>> => {
  return api.put('/users/profile', userData);
};

export const getAllUsers = (): Promise<AxiosResponse<User[]>> => {
  return api.get('/users');
};

export const deleteUser = (id: number): Promise<AxiosResponse<{ message: string }>> => {
  return api.delete(`/users/${id}`);
};

// Subject services
export const getAllSubjects = (): Promise<AxiosResponse<Subject[]>> => {
  return api.get('/subjects');
};

export const getSubjectById = (id: number): Promise<AxiosResponse<Subject>> => {
  return api.get(`/subjects/${id}`);
};

export const createSubject = (subjectData: Partial<Subject>): Promise<AxiosResponse<{ message: string; subject: Subject }>> => {
  return api.post('/subjects', subjectData);
};

export const updateSubject = (id: number, subjectData: Partial<Subject>): Promise<AxiosResponse<{ message: string; subject: Subject }>> => {
  return api.put(`/subjects/${id}`, subjectData);
};

export const deleteSubject = (id: number): Promise<AxiosResponse<{ message: string }>> => {
  return api.delete(`/subjects/${id}`);
};

// Chapter services
export const getAllChapters = (): Promise<AxiosResponse<Chapter[]>> => {
  return api.get('/chapters');
};

export const getChaptersBySubject = (subjectId: number): Promise<AxiosResponse<Chapter[]>> => {
  return api.get(`/chapters/subject/${subjectId}`);
};

export const getChapterById = (id: number): Promise<AxiosResponse<Chapter>> => {
  return api.get(`/chapters/${id}`);
};

export const createChapter = (chapterData: Partial<Chapter>): Promise<AxiosResponse<{ message: string; chapter: Chapter }>> => {
  return api.post('/chapters', chapterData);
};

export const updateChapter = (id: number, chapterData: Partial<Chapter>): Promise<AxiosResponse<{ message: string; chapter: Chapter }>> => {
  return api.put(`/chapters/${id}`, chapterData);
};

export const deleteChapter = (id: number): Promise<AxiosResponse<{ message: string }>> => {
  return api.delete(`/chapters/${id}`);
};

// Quiz services
export const getAllQuizzes = (): Promise<AxiosResponse<Quiz[]>> => {
  return api.get('/quizzes');
};

export const getQuizzesByChapter = (chapterId: number): Promise<AxiosResponse<Quiz[]>> => {
  return api.get(`/quizzes/chapter/${chapterId}`);
};

export const getQuizById = (id: number): Promise<AxiosResponse<Quiz>> => {
  return api.get(`/quizzes/${id}`);
};

export const createQuiz = (quizData: Partial<Quiz>): Promise<AxiosResponse<{ message: string; quiz: Quiz }>> => {
  return api.post('/quizzes', quizData);
};

export const updateQuiz = (id: number, quizData: Partial<Quiz>): Promise<AxiosResponse<{ message: string; quiz: Quiz }>> => {
  return api.put(`/quizzes/${id}`, quizData);
};

export const deleteQuiz = (id: number): Promise<AxiosResponse<{ message: string }>> => {
  return api.delete(`/quizzes/${id}`);
};

// Question services
export const getQuestionsByQuiz = (quizId: number): Promise<AxiosResponse<Question[]>> => {
  return api.get(`/questions/quiz/${quizId}`);
};

export const getQuestionsByQuizForUser = (quizId: number): Promise<AxiosResponse<Question[]>> => {
  return api.get(`/questions/quiz/${quizId}/user`);
};

export const createQuestion = (questionData: Partial<Question>): Promise<AxiosResponse<{ message: string; question: Question }>> => {
  return api.post('/questions', questionData);
};

export const updateQuestion = (id: number, questionData: Partial<Question>): Promise<AxiosResponse<{ message: string; question: Question }>> => {
  return api.put(`/questions/${id}`, questionData);
};

export const deleteQuestion = (id: number): Promise<AxiosResponse<{ message: string }>> => {
  return api.delete(`/questions/${id}`);
};

// Score services
export const submitQuiz = (submissionData: QuizSubmissionData): Promise<AxiosResponse<{ message: string; score: Score; percentage: number }>> => {
  return api.post('/scores/submit', submissionData);
};

export const getUserScores = (): Promise<AxiosResponse<Score[]>> => {
  return api.get('/scores/user');
};

export const getUserStats = (): Promise<AxiosResponse<UserStats>> => {
  return api.get('/scores/user/stats');
};

export const getScoresByQuiz = (quizId: number): Promise<AxiosResponse<Score[]>> => {
  return api.get(`/scores/quiz/${quizId}`);
};

export const getAllScores = (): Promise<AxiosResponse<Score[]>> => {
  return api.get('/scores');
};

export default api; 