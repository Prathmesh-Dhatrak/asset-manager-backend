import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { AuthRequest } from '../types/request.types';

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  // Extract token
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }

  // Attach user to request
  (req as AuthRequest).user = {
    id: decoded.id,
    email: decoded.email,
  };

  next();
}