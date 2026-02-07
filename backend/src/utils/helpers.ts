import { User, PublicUser } from '../types';

/**
 * Format a user object for public response (remove sensitive data)
 */
export const formatPublicUser = (user: User): PublicUser => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    isVerified: user.is_verified,
    createdAt: user.created_at,
    lastLoginAt: user.last_login_at,
  };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const isStrongPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

/**
 * Sanitize string input
 */
export const sanitizeString = (str: string | undefined | null): string | null => {
  if (!str) return null;
  return str.trim().replace(/[<>]/g, '');
};