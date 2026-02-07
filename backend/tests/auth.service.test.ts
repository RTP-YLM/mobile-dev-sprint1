/**
 * Unit Tests for Auth Service
 */

import { AuthService } from '../src/services/auth.service';
import { UserModel } from '../src/models/user.model';
import { RefreshTokenModel } from '../src/models/refresh-token.model';
import { ValidationError, AuthenticationError, ConflictError } from '../src/types/errors';
import * as authUtils from '../src/utils/auth';

// Mock dependencies
jest.mock('../src/models/user.model');
jest.mock('../src/models/refresh-token.model');
jest.mock('../src/utils/auth');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        password_hash: 'hashed',
        first_name: 'Test',
        last_name: 'User',
        is_verified: false,
        is_active: true,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: null,
      };

      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);
      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
      (authUtils.hashPassword as jest.Mock).mockResolvedValue('hashed');
      (authUtils.generateAccessToken as jest.Mock).mockReturnValue('access-token');
      (authUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh-token');
      (authUtils.hashToken as jest.Mock).mockReturnValue('hashed-token');
      (authUtils.calculateRefreshExpiry as jest.Mock).mockReturnValue(new Date());
      (RefreshTokenModel.create as jest.Mock).mockResolvedValue({});

      const result = await AuthService.register({
        email: 'test@example.com',
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens.accessToken).toBe('access-token');
      expect(UserModel.create).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid email', async () => {
      await expect(
        AuthService.register({ email: 'invalid', password: 'TestPass123!' })
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for weak password', async () => {
      await expect(
        AuthService.register({ email: 'test@example.com', password: '123' })
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ConflictError for existing email', async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue({ id: 'existing' });

      await expect(
        AuthService.register({ email: 'test@example.com', password: 'TestPass123!' })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        password_hash: 'hashed',
        first_name: null,
        last_name: null,
        is_verified: false,
        is_active: true,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: null,
      };

      (UserModel.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (authUtils.comparePassword as jest.Mock).mockResolvedValue(true);
      (UserModel.updateLastLogin as jest.Mock).mockResolvedValue(undefined);
      (authUtils.generateAccessToken as jest.Mock).mockReturnValue('access-token');
      (authUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh-token');
      (authUtils.hashToken as jest.Mock).mockReturnValue('hashed-token');
      (authUtils.calculateRefreshExpiry as jest.Mock).mockReturnValue(new Date());
      (RefreshTokenModel.create as jest.Mock).mockResolvedValue({});

      const result = await AuthService.login('test@example.com', 'TestPass123!');

      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens.accessToken).toBe('access-token');
      expect(UserModel.updateLastLogin).toHaveBeenCalledWith('test-id');
    });

    it('should throw AuthenticationError for non-existent user', async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login('test@example.com', 'TestPass123!')
      ).rejects.toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError for wrong password', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        password_hash: 'hashed',
        is_active: true,
      };

      (UserModel.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (authUtils.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        AuthService.login('test@example.com', 'WrongPass123!')
      ).rejects.toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError for inactive account', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        password_hash: 'hashed',
        is_active: false,
      };

      (UserModel.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (authUtils.comparePassword as jest.Mock).mockResolvedValue(true);

      await expect(
        AuthService.login('test@example.com', 'TestPass123!')
      ).rejects.toThrow(AuthenticationError);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      (authUtils.hashToken as jest.Mock).mockReturnValue('hashed-token');
      (RefreshTokenModel.revoke as jest.Mock).mockResolvedValue(true);

      await AuthService.logout('refresh-token');

      expect(RefreshTokenModel.revoke).toHaveBeenCalledWith('hashed-token');
    });

    it('should throw ValidationError for missing token', async () => {
      await expect(AuthService.logout('')).rejects.toThrow(ValidationError);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        is_active: true,
      };

      const mockToken = {
        id: 'token-id',
        user_id: 'test-id',
        token_hash: 'hashed-token',
      };

      (authUtils.verifyRefreshToken as jest.Mock).mockReturnValue({ userId: 'test-id' });
      (authUtils.hashToken as jest.Mock).mockReturnValue('hashed-token');
      (RefreshTokenModel.findByHash as jest.Mock).mockResolvedValue(mockToken);
      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
      (RefreshTokenModel.revoke as jest.Mock).mockResolvedValue(true);
      (authUtils.generateAccessToken as jest.Mock).mockReturnValue('new-access-token');
      (authUtils.generateRefreshToken as jest.Mock).mockReturnValue('new-refresh-token');
      (authUtils.calculateRefreshExpiry as jest.Mock).mockReturnValue(new Date());
      (RefreshTokenModel.create as jest.Mock).mockResolvedValue({});

      const result = await AuthService.refreshTokens('refresh-token');

      expect(result.accessToken).toBe('new-access-token');
      expect(RefreshTokenModel.revoke).toHaveBeenCalledWith('hashed-token');
    });

    it('should throw AuthenticationError for invalid token', async () => {
      (authUtils.verifyRefreshToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        AuthService.refreshTokens('invalid-token')
      ).rejects.toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError for revoked token', async () => {
      (authUtils.verifyRefreshToken as jest.Mock).mockReturnValue({ userId: 'test-id' });
      (authUtils.hashToken as jest.Mock).mockReturnValue('hashed-token');
      (RefreshTokenModel.findByHash as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.refreshTokens('revoked-token')
      ).rejects.toThrow(AuthenticationError);
    });
  });
});