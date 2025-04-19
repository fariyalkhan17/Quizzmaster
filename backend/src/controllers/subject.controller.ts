import { Request, Response } from 'express';
import { Subject, Chapter } from '../models';

// Create a new subject (admin only)
export const createSubject = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, description } = req.body;
    
    // Check if subject exists
    const subjectExists = await Subject.findOne({ where: { name } });
    if (subjectExists) {
      return res.status(400).json({ message: 'Subject already exists' });
    }
    
    const subject = await Subject.create({
      name,
      description
    });
    
    return res.status(201).json({
      message: 'Subject created successfully',
      subject
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all subjects
export const getAllSubjects = async (req: Request, res: Response): Promise<Response> => {
  try {
    const subjects = await Subject.findAll({
      include: [
        {
          model: Chapter,
          as: 'chapters'
        }
      ]
    });
    
    return res.status(200).json(subjects);
  } catch (error) {
    console.error('Error getting subjects:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get subject by ID
export const getSubjectById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const subject = await Subject.findByPk(parseInt(id), {
      include: [
        {
          model: Chapter,
          as: 'chapters'
        }
      ]
    });
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    return res.status(200).json(subject);
  } catch (error) {
    console.error('Error getting subject:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update subject (admin only)
export const updateSubject = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const subject = await Subject.findByPk(parseInt(id));
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    await subject.update({
      name: name || subject.get('name'),
      description: description || subject.get('description')
    });
    
    return res.status(200).json({
      message: 'Subject updated successfully',
      subject
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete subject (admin only)
export const deleteSubject = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const subject = await Subject.findByPk(parseInt(id));
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    await subject.destroy();
    
    return res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 