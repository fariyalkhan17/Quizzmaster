import { Request, Response } from 'express';
import { Quiz, Chapter, Question } from '../models';

// Create a new quiz (admin only)
export const createQuiz = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, chapterId, timeLimit } = req.body;
    
    // Check if chapter exists
    const chapter = await Chapter.findByPk(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    // Check if quiz exists in the chapter
    const quizExists = await Quiz.findOne({ 
      where: { 
        name: title,
        chapter_id: chapterId 
      } 
    });
    
    if (quizExists) {
      return res.status(400).json({ message: 'Quiz already exists in this chapter' });
    }
    
    const quiz = await Quiz.create({
      name: title,
      remarks: description,
      chapter_id: chapterId,
      date_of_quiz: new Date(),
      time_duration: timeLimit || '00:30' // Default 30 minutes
    });
    
    return res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all quizzes
export const getAllQuizzes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const quizzes = await Quiz.findAll({
      include: [
        {
          model: Chapter,
          as: 'chapter',
          attributes: ['id', 'name']
        }
      ]
    });
    
    return res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error getting quizzes:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get quizzes by chapter ID
export const getQuizzesByChapter = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { chapterId } = req.params;
    
    const quizzes = await Quiz.findAll({
      where: { chapter_id: parseInt(chapterId) }
    });
    
    return res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error getting quizzes by chapter:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get quiz by ID
export const getQuizById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const quiz = await Quiz.findByPk(parseInt(id), {
      include: [
        {
          model: Chapter,
          as: 'chapter'
        },
        {
          model: Question,
          as: 'questions'
        }
      ]
    });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    return res.status(200).json(quiz);
  } catch (error) {
    console.error('Error getting quiz:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update quiz (admin only)
export const updateQuiz = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { title, description, chapterId, timeLimit } = req.body;
    
    const quiz = await Quiz.findByPk(parseInt(id));
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // If changing chapter, verify chapter exists
    if (chapterId && chapterId !== quiz.get('chapter_id')) {
      const chapter = await Chapter.findByPk(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
    }
    
    await quiz.update({
      name: title || quiz.get('name'),
      remarks: description || quiz.get('remarks'),
      chapter_id: chapterId || quiz.get('chapter_id'),
      time_duration: timeLimit || quiz.get('time_duration')
    });
    
    return res.status(200).json({
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete quiz (admin only)
export const deleteQuiz = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const quiz = await Quiz.findByPk(parseInt(id));
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    await quiz.destroy();
    
    return res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 