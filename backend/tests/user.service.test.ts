/**
 * Unit Tests for User Service
 */

import { UserService } from '../src/services/user.service';
import { UserModel } from '../src/models/user.model';
import { NotFoundError, ValidationError, ConflictError } from '../src/types/errors';

jest.mock('../src/models/user.model');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        is_verified: false,
        is_active: true,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: null,
        password_hash: 'hashed',
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.getProfile('test-id');

      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('User');
    });

    it('should throw NotFoundError for non-existent user', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(UserService.getProfile('non-existent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        first_name: 'Updated',
        last_name: 'Name',
        is_verified: false,
        is_active: true,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: null,
        password_hash: 'hashed',
      };

      (UserModel.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.updateProfile('test-id', {
        firstName: 'Updated',
        lastName: 'Name',
      });

      expect(result.firstName).toBe('Updated');
      expect(result.lastName).toBe('Name');
    });

    it('should throw ValidationError for invalid email', async () => {
      await expect(
        UserService.updateProfile('test-id', { email: 'invalid-email' })
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ConflictError for email already in use', async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue({
        id: 'other-id',
        email: 'taken@example.com',
      });

      await expect(
        UserService.updateProfile('test-id', { email: 'taken@example.com' })
      ).rejects.toThrow(ConflictError);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      (UserModel.update as jest.Mock).mockResolvedValue(null);

      await expect(
        UserService.updateProfile('non-existent', { firstName: 'Test' })
      ).rejects.toThrow(NotFoundError);
    });
  });
});