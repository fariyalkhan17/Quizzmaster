import { Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models';
import { UserAttributes } from '../models/interfaces';

// Register a new user
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password, fullName, qualification, dob } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      password: hashedPassword,
      fullName,
      qualification,
      dob,
      role: 'user' // Default role
    });

    // Remove password from response
    const userResponse = user.toJSON() as UserAttributes;
    delete userResponse.password;

    return res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.get('password') as string);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.get('id'), role: user.get('role') },
      process.env.JWT_SECRET || 'quizmaster_secret_key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toJSON() as UserAttributes;
    delete userResponse.password;

    return res.status(200).json({
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 