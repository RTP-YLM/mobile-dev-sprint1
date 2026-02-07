import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { JwtPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a password with its hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  const { userId, email } = payload;
  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY,
  });
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY,
  });
};

/**
 * Verify JWT access token
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

/**
 * Verify JWT refresh token
 */
export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
};

/**
 * Generate a random token for refresh token hashing
 */
export const generateRandomToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Hash a refresh token for storage
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Calculate expiry date for refresh token
 */
export const calculateRefreshExpiry = (): Date => {
  const days = parseInt(JWT_REFRESH_EXPIRY.replace('d', ''), 10) || 7;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  return expiryDate;
};