import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models';
import { UserInstance } from '../models/interfaces';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: UserInstance;
    }
  }
}

interface JwtPayload {
  id: number;
  role: string;
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const jwtSecret: Secret = process.env.JWT_SECRET || 'quizmaster_secret_key';
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void | Response => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Require Admin Role!' });
  }
}; 