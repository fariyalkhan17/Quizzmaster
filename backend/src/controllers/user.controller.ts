import { Request, Response } from 'express';
import { User } from '../models';
import { UserAttributes } from '../models/interfaces';

// Get all users (for admin)
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.user!;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error getting profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.user!;
    const { fullName, qualification, dob } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    await user.update({
      fullName: fullName || user.get('fullName'),
      qualification: qualification || user.get('qualification'),
      dob: dob || user.get('dob')
    });
    
    // Remove password from response
    const userResponse = user.toJSON() as UserAttributes;
    delete userResponse.password;
    
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user (admin only)
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(parseInt(id));
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Admin can't be deleted
    if (user.get('role') === 'admin') {
      return res.status(403).json({ message: 'Admin user cannot be deleted' });
    }
    
    await user.destroy();
    
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 