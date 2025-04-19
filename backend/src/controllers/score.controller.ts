import { Request, Response } from 'express';
import { Score, Quiz, Question, User } from '../models';
import { Op } from 'sequelize';

// Submit a quiz and calculate score
export const submitQuiz = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.user!;
    const { quiz_id, answers, time_taken } = req.body;
    
    // Check if quiz exists
    const quiz = await Quiz.findByPk(quiz_id, {
      include: [
        {
          model: Question,
          as: 'questions'
        }
      ]
    });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Get all questions for the quiz
    const questions = await Question.findAll({
      where: { quiz_id }
    });
    
    if (questions.length === 0) {
      return res.status(400).json({ message: 'No questions found for this quiz' });
    }
    
    // Calculate score
    let correctAnswers = 0;
    
    for (const answer of answers) {
      const question = questions.find(q => q.get('id') === answer.question_id);
      
      if (question && question.get('correct_option') === answer.selected_option) {
        correctAnswers++;
      }
    }
    
    const totalQuestions = questions.length;
    const percentageScore = (correctAnswers / totalQuestions) * 100;
    
    // Create score record
    const score = await Score.create({
      quiz_id,
      user_id: id,
      time_stamp_of_attempt: new Date(),
      total_questions: totalQuestions,
      total_scored: correctAnswers,
      time_taken
    });
    
    return res.status(201).json({
      message: 'Quiz submitted successfully',
      score,
      percentage: percentageScore
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get scores for the logged-in user
export const getUserScores = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.user!;
    
    const scores = await Score.findAll({
      where: { user_id: id },
      include: [
        {
          model: Quiz,
          as: 'quiz'
        }
      ],
      order: [['time_stamp_of_attempt', 'DESC']]
    });
    
    return res.status(200).json(scores);
  } catch (error) {
    console.error('Error getting user scores:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get stats for the logged-in user
export const getUserStats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.user!;
    
    const scores = await Score.findAll({
      where: { user_id: id }
    });
    
    if (scores.length === 0) {
      return res.status(200).json({
        totalQuizzes: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        averageScore: 0
      });
    }
    
    const totalQuizzes = scores.length;
    const totalQuestions = scores.reduce((sum, score) => sum + score.get('total_questions'), 0);
    const totalCorrect = scores.reduce((sum, score) => sum + score.get('total_scored'), 0);
    const averageScore = (totalCorrect / totalQuestions) * 100;
    
    return res.status(200).json({
      totalQuizzes,
      totalQuestions,
      totalCorrect,
      averageScore: Math.round(averageScore * 100) / 100
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get scores by quiz (admin only)
export const getScoresByQuiz = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { quizId } = req.params;
    
    const scores = await Score.findAll({
      where: { quiz_id: parseInt(quizId) },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName']
        }
      ],
      order: [['time_stamp_of_attempt', 'DESC']]
    });
    
    return res.status(200).json(scores);
  } catch (error) {
    console.error('Error getting scores by quiz:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all scores (admin only)
export const getAllScores = async (req: Request, res: Response): Promise<Response> => {
  try {
    const scores = await Score.findAll({
      include: [
        {
          model: Quiz,
          as: 'quiz'
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName']
        }
      ],
      order: [['time_stamp_of_attempt', 'DESC']]
    });
    
    return res.status(200).json(scores);
  } catch (error) {
    console.error('Error getting all scores:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 