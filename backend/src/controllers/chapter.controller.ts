import { Request, Response } from 'express';
import { Chapter, Subject, Quiz } from '../models';

// Create a new chapter (admin only)
export const createChapter = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, description, subjectId } = req.body;
    
    // Check if subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Check if chapter exists in the subject
    const chapterExists = await Chapter.findOne({ 
      where: { 
        name,
        subject_id: subjectId 
      } 
    });
    
    if (chapterExists) {
      return res.status(400).json({ message: 'Chapter already exists in this subject' });
    }
    
    const chapter = await Chapter.create({
      name,
      description,
      subject_id: subjectId
    });
    
    return res.status(201).json({
      message: 'Chapter created successfully',
      chapter
    });
  } catch (error) {
    console.error('Error creating chapter:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all chapters
export const getAllChapters = async (req: Request, res: Response): Promise<Response> => {
  try {
    const chapters = await Chapter.findAll({
      include: [
        {
          model: Subject,
          as: 'subject'
        },
        {
          model: Quiz,
          as: 'quizzes'
        }
      ]
    });
    
    return res.status(200).json(chapters);
  } catch (error) {
    console.error('Error getting chapters:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get chapters by subject ID
export const getChaptersBySubject = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { subjectId } = req.params;
    
    const chapters = await Chapter.findAll({
      where: { subject_id: parseInt(subjectId) },
      include: [
        {
          model: Quiz,
          as: 'quizzes'
        }
      ]
    });
    
    return res.status(200).json(chapters);
  } catch (error) {
    console.error('Error getting chapters by subject:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get chapter by ID
export const getChapterById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const chapter = await Chapter.findByPk(parseInt(id), {
      include: [
        {
          model: Subject,
          as: 'subject'
        },
        {
          model: Quiz,
          as: 'quizzes'
        }
      ]
    });
    
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    return res.status(200).json(chapter);
  } catch (error) {
    console.error('Error getting chapter:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update chapter (admin only)
export const updateChapter = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, description, subjectId } = req.body;
    
    const chapter = await Chapter.findByPk(parseInt(id));
    
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    // If changing subject, verify subject exists
    if (subjectId && subjectId !== chapter.get('subject_id')) {
      const subject = await Subject.findByPk(subjectId);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
    }
    
    await chapter.update({
      name: name || chapter.get('name'),
      description: description || chapter.get('description'),
      subject_id: subjectId || chapter.get('subject_id')
    });
    
    return res.status(200).json({
      message: 'Chapter updated successfully',
      chapter
    });
  } catch (error) {
    console.error('Error updating chapter:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete chapter (admin only)
export const deleteChapter = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const chapter = await Chapter.findByPk(parseInt(id));
    
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    await chapter.destroy();
    
    return res.status(200).json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 