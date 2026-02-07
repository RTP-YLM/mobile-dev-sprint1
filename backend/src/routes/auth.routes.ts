import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  authController.registerValidation,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  authController.loginValidation,
  authController.login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post(
  '/logout',
  authController.logoutValidation,
  authController.logout
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  authController.refreshValidation,
  authController.refresh
);

export default router;