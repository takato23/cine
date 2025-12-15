import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { jwtSecret } from '../config';

type UserRole = 'ADMIN' | 'STAFF' | 'CLIENT';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: UserRole;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      role: UserRole;
    };

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!roles.includes(req.userRole)) {
      return next(new AppError('Forbidden', 403));
    }

    next();
  };
};

