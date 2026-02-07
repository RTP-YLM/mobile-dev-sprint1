import { Response } from 'express';
import { AppError } from '../types/errors';

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>[];
}

export const success = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };
  
  if (message) {
    response.message = message;
  }
  
  return res.status(statusCode).json(response);
};

export const error = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: Record<string, string>[]
): Response => {
  const response: ErrorResponse = {
    success: false,
    message,
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

export const handleAppError = (err: AppError, res: Response): Response => {
  return error(res, err.message, err.statusCode, 'errors' in err ? (err as any).errors : undefined);
};