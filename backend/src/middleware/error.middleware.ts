import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError as ExpressValidationError } from 'express-validator';
import { AppError, ValidationError } from '../types/errors';

/**
 * Centralized Error Handler Middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Handle AppError instances
  if (err instanceof AppError) {
    const response: any = {
      success: false,
      message: err.message,
    };

    if (err instanceof ValidationError && err.errors.length > 0) {
      response.errors = err.errors;
    }

    return res.status(err.statusCode).json(response);
  }

  // Handle express-validator errors
  if (Array.isArray((err as any).errors) && (err as any).errors[0]?.msg) {
    const validationErrors = (err as any).errors.map((e: ExpressValidationError) => ({
      field: (e as any).param || (e as any).path,
      message: e.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors,
    });
  }

  // Handle unexpected errors
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(isDevelopment && { stack: err.stack }),
  });
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, res: Response): Response => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

/**
 * Validation Result Handler
 * Use this after express-validator chains
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
    return;
  }
  
  next();
};