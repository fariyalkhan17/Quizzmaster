import bcrypt from 'bcrypt';
import { User } from '../models';

export const initializeAdmin = async (): Promise<void> => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      username: 'admin@quizmaster.com',
      password: hashedPassword,
      fullName: 'Admin User',
      role: 'admin'
    });
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
}; 