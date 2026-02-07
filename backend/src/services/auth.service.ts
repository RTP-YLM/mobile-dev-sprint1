import { UserModel } from '../models/user.model';
import { RefreshTokenModel } from '../models/refresh-token.model';
import { 
  hashPassword, 
  comparePassword, 
  generateAccessToken, 
  generateRefreshToken,
  hashToken,
  calculateRefreshExpiry,
  verifyRefreshToken
} from '../utils/auth';
import { formatPublicUser, isValidEmail, isStrongPassword } from '../utils/helpers';
import { 
  CreateUserInput, 
  UpdateUserInput, 
  AuthTokens, 
  PublicUser,
  User 
} from '../types';
import { 
  AuthenticationError, 
  ConflictError, 
  ValidationError,
  NotFoundError 
} from '../types/errors';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData: CreateUserInput): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const { email, password, firstName, lastName } = userData;

    // Validate email
    if (!email || !isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    // Validate password strength
    if (!password || !isStrongPassword(password)) {
      throw new ValidationError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
      );
    }

    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await UserModel.create({
      email,
      password_hash: passwordHash,
      firstName,
      lastName,
    });

    // Generate tokens
    const tokens = await this.generateAuthTokens(user);

    console.log(`User registered: ${user.email} (${user.id})`);

    return {
      user: formatPublicUser(user),
      tokens,
    };
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AuthenticationError('Account is deactivated');
    }

    // Update last login
    await UserModel.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateAuthTokens(user);

    console.log(`User logged in: ${user.email} (${user.id})`);

    return {
      user: formatPublicUser({ ...user, last_login_at: new Date() }),
      tokens,
    };
  }

  /**
   * Logout user (revoke refresh token)
   */
  static async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    const tokenHash = hashToken(refreshToken);
    await RefreshTokenModel.revoke(tokenHash);

    console.log(`User logged out, token revoked`);
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new AuthenticationError('Refresh token is required');
    }

    // Verify token signature
    let payload: { userId: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Check if token exists and is not revoked
    const tokenHash = hashToken(refreshToken);
    const storedToken = await RefreshTokenModel.findByHash(tokenHash);
    
    if (!storedToken) {
      throw new AuthenticationError('Refresh token not found or expired');
    }

    // Get user
    const user = await UserModel.findById(payload.userId);
    if (!user || !user.is_active) {
      throw new AuthenticationError('User not found or deactivated');
    }

    // Revoke old token
    await RefreshTokenModel.revoke(tokenHash);

    // Generate new tokens
    const tokens = await this.generateAuthTokens(user);

    console.log(`Tokens refreshed for user: ${user.email} (${user.id})`);

    return tokens;
  }

  /**
   * Generate new auth tokens
   */
  private static async generateAuthTokens(user: User): Promise<AuthTokens> {
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = calculateRefreshExpiry();

    // Store refresh token hash
    await RefreshTokenModel.create(user.id, refreshTokenHash, expiresAt);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}