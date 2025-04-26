import { Request, Response } from 'express';
import { Question, Quiz } from '../models';

// Create a new question (admin only)
export const createQuestion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { 
      quizId, 
      text, 
      option1,
      option2,
      option3,
      option4,
      correct_option
    } = req.body;
    
    // Check if quiz exists
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Create question
    const question = await Question.create({
      quiz_id: quizId,
      question_statement: text,
      option1,
      option2,
      option3,
      option4,
      correct_option
    });
    
    return res.status(201).json({
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    console.error('Error creating question:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all questions for a quiz
export const getQuestionsByQuiz = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { quizId } = req.params;
    
    const questions = await Question.findAll({
      where: { quiz_id: parseInt(quizId) }
    });
    
    return res.status(200).json(questions);
  } catch (error) {
    console.error('Error getting questions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get question by ID
export const getQuestionById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const question = await Question.findByPk(parseInt(id));
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    return res.status(200).json(question);
  } catch (error) {
    console.error('Error getting question:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update question (admin only)
export const updateQuestion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { 
      text, 
      option1,
      option2,
      option3,
      option4,
      correct_option,
      quizId 
    } = req.body;
    
    const question = await Question.findByPk(parseInt(id));
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // If changing quiz, verify quiz exists
    if (quizId && quizId !== question.get('quiz_id')) {
      const quiz = await Quiz.findByPk(quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
    }
    
    await question.update({
      question_statement: text || question.get('question_statement'),
      option1: option1 || question.get('option1'),
      option2: option2 || question.get('option2'),
      option3: option3 || question.get('option3'),
      option4: option4 || question.get('option4'),
      correct_option: correct_option || question.get('correct_option'),
      quiz_id: quizId || question.get('quiz_id')
    });
    
    return res.status(200).json({
      message: 'Question updated successfully',
      question
    });
  } catch (error) {
    console.error('Error updating question:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete question (admin only)
export const deleteQuestion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const question = await Question.findByPk(parseInt(id));
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    await question.destroy();
    
    return res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all questions for a quiz for users (doesn't include correct answers)
export const getQuestionsByQuizForUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { quizId } = req.params;
    
    const questions = await Question.findAll({
      where: { quiz_id: parseInt(quizId) },
      attributes: ['id', 'quiz_id', 'question_statement', 'option1', 'option2', 'option3', 'option4']
    });
    
    return res.status(200).json(questions);
  } catch (error) {
    console.error('Error getting questions for user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 