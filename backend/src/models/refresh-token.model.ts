import { query } from '../config/database';
import { RefreshToken } from '../types';

export class RefreshTokenModel {
  /**
   * Create a new refresh token
   */
  static async create(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshToken> {
    const result = await query<RefreshToken>(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, tokenHash, expiresAt]
    );
    
    return result.rows[0];
  }

  /**
   * Find refresh token by hash
   */
  static async findByHash(tokenHash: string): Promise<RefreshToken | null> {
    const result = await query<RefreshToken>(
      `SELECT * FROM refresh_tokens 
       WHERE token_hash = $1 
       AND is_revoked = FALSE 
       AND expires_at > CURRENT_TIMESTAMP`,
      [tokenHash]
    );
    
    return result.rows[0] || null;
  }

  /**
   * Find all active tokens for a user
   */
  static async findByUserId(userId: string): Promise<RefreshToken[]> {
    const result = await query<RefreshToken>(
      `SELECT * FROM refresh_tokens 
       WHERE user_id = $1 
       AND is_revoked = FALSE 
       AND expires_at > CURRENT_TIMESTAMP 
       ORDER BY created_at DESC`,
      [userId]
    );
    
    return result.rows;
  }

  /**
   * Revoke a specific token
   */
  static async revoke(tokenHash: string): Promise<boolean> {
    const result = await query(
      `UPDATE refresh_tokens 
       SET is_revoked = TRUE, revoked_at = CURRENT_TIMESTAMP 
       WHERE token_hash = $1 AND is_revoked = FALSE`,
      [tokenHash]
    );
    
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Revoke all tokens for a user
   */
  static async revokeAllForUser(userId: string): Promise<number> {
    const result = await query(
      `UPDATE refresh_tokens 
       SET is_revoked = TRUE, revoked_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND is_revoked = FALSE`,
      [userId]
    );
    
    return result.rowCount ?? 0;
  }

  /**
   * Clean up expired tokens
   */
  static async cleanupExpired(): Promise<number> {
    const result = await query(
      `DELETE FROM refresh_tokens 
       WHERE expires_at < CURRENT_TIMESTAMP 
       OR is_revoked = TRUE`,
      []
    );
    
    return result.rowCount ?? 0;
  }
}