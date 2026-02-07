import { UserModel } from '../models/user.model';
import { formatPublicUser } from '../utils/helpers';
import { UpdateUserInput, PublicUser } from '../types';
import { NotFoundError, ValidationError, ConflictError } from '../types/errors';
import { isValidEmail } from '../utils/helpers';

export class UserService {
  /**
   * Get current user profile
   */
  static async getProfile(userId: string): Promise<PublicUser> {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return formatPublicUser(user);
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updateData: UpdateUserInput): Promise<PublicUser> {
    // Validate email if provided
    if (updateData.email !== undefined) {
      if (!isValidEmail(updateData.email)) {
        throw new ValidationError('Invalid email format');
      }

      // Check if email is already taken by another user
      const existingUser = await UserModel.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError('Email already in use');
      }
    }

    const user = await UserModel.update(userId, updateData);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    console.log(`User profile updated: ${user.email} (${user.id})`);

    return formatPublicUser(user);
  }
}