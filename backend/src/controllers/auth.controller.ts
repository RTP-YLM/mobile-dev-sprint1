import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { handleValidationErrors } from '../middleware/error.middleware';
import { success } from '../utils/response';

/**
 * Validation rules for registration
 */
export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters'),
  handleValidationErrors,
];

/**
 * Validation rules for login
 */
export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

/**
 * Validation rules for refresh token
 */
export const refreshValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
  handleValidationErrors,
];

/**
 * Validation rules for logout
 */
export const logoutValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
  handleValidationErrors,
];

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
    });

    success(res, result, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const result = await AuthService.login(email, password);

    success(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    await AuthService.logout(refreshToken);

    success(res, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    const tokens = await AuthService.refreshTokens(refreshToken);

    success(res, { tokens }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};