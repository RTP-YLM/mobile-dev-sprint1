import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/auth';
import { JwtPayload } from '../types';
import { AuthenticationError } from '../types/errors';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * JWT Authentication Middleware
 * Verifies the access token and attaches user payload to request
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AuthenticationError('Authorization header is required');
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AuthenticationError('Authorization header must be in format: Bearer <token>');
    }

    const token = parts[1];

    if (!token) {
      throw new AuthenticationError('Token is required');
    }

    // Verify token
    const payload = verifyAccessToken(token);
    
    // Attach user to request
    req.user = payload;
    
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
      return;
    }
    
    // Handle JWT-specific errors
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        next(new AuthenticationError('Token has expired'));
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        next(new AuthenticationError('Invalid token'));
        return;
      }
    }
    
    next(new AuthenticationError('Authentication failed'));
  }
};

/**
 * Optional authentication middleware
 * Attaches user to request if token is valid, but doesn't require it
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];
    
    if (!token) {
      return next();
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    
    next();
  } catch {
    // Ignore errors for optional auth
    next();
  }
};