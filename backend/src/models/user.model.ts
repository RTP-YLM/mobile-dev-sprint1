import { query } from '../config/database';
import { User, CreateUserInput, UpdateUserInput } from '../types';

export class UserModel {
  /**
   * Find user by ID (excluding soft-deleted)
   */
  static async findById(id: string): Promise<User | null> {
    const result = await query<User>(
      'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Find user by email (excluding soft-deleted)
   */
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query<User>(
      'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email.toLowerCase()]
    );
    return result.rows[0] || null;
  }

  /**
   * Check if email already exists (including soft-deleted)
   */
  static async emailExists(email: string): Promise<boolean> {
    const result = await query(
      'SELECT 1 FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Create a new user
   */
  static async create(userData: CreateUserInput & { password_hash: string }): Promise<User> {
    const { email, password_hash, firstName, lastName } = userData;
    
    const result = await query<User>(
      `INSERT INTO users (email, password_hash, first_name, last_name) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [email.toLowerCase(), password_hash, firstName || null, lastName || null]
    );
    
    return result.rows[0];
  }

  /**
   * Update user by ID
   */
  static async update(id: string, updateData: UpdateUserInput): Promise<User | null> {
    const fields: string[] = [];
    const values: (string | null)[] = [];
    let paramIndex = 1;

    if (updateData.firstName !== undefined) {
      fields.push(`first_name = $${paramIndex++}`);
      values.push(updateData.firstName || null);
    }

    if (updateData.lastName !== undefined) {
      fields.push(`last_name = $${paramIndex++}`);
      values.push(updateData.lastName || null);
    }

    if (updateData.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(updateData.email.toLowerCase());
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query<User>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} AND deleted_at IS NULL RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(id: string): Promise<void> {
    await query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }

  /**
   * Soft delete user
   */
  static async softDelete(id: string): Promise<boolean> {
    const result = await query(
      'UPDATE users SET deleted_at = CURRENT_TIMESTAMP, is_active = FALSE WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Hard delete user (use with caution)
   */
  static async hardDelete(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}