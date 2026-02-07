export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  is_verified: boolean;
  is_active: boolean;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface PublicUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export interface RefreshToken {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  is_revoked: boolean;
  created_at: Date;
  revoked_at: Date | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Express.Request {
  user?: JwtPayload;
}

// Re-export errors
export * from './errors';