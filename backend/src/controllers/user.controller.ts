import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { UserService } from '../services/user.service';
import { handleValidationErrors } from '../middleware/error.middleware';
import { success } from '../utils/response';

/**
 * Validation rules for updating user profile
 */
export const updateProfileValidation = [
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
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  handleValidationErrors,
];

/**
 * Get current user profile
 * GET /api/users/me
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    
    const user = await UserService.getProfile(userId);

    success(res, { user }, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile
 * PUT /api/users/me
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { firstName, lastName, email } = req.body;
    
    const user = await UserService.updateProfile(userId, {
      firstName,
      lastName,
      email,
    });

    success(res, { user }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};