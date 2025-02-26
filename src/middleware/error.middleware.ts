import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  errors?: any[];
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // If the error has a status code, use it, otherwise use 500
  const statusCode = err.statusCode || 500;
  
  // Create the error response
  const errorResponse = {
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(err.errors && { errors: err.errors })
  };

  // Send the error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware to handle 404 errors for routes that don't exist
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: AppError = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};