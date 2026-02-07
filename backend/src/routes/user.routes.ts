import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as userController from '../controllers/user.controller';

const router = Router();

/**
 * All routes require authentication
 */
router.use(authenticate);

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  userController.getProfile
);

/**
 * @route   PUT /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/me',
  userController.updateProfileValidation,
  userController.updateProfile
);

export default router;