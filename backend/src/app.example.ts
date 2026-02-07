/**
 * Example Express App Structure
 * This is a reference for what your backend should implement
 * Tests expect these endpoints to exist
 */

import express from 'express';

const app = express();
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================================
// AUTH ENDPOINTS
// ==========================================

/**
 * POST /api/auth/register
 * Register a new user
 * 
 * Body: { email, password, name }
 * Success: 201 { success: true, data: { userId, email, token } }
 * Error: 400/409 { success: false, error: { code, message } }
 */
app.post('/api/auth/register', (req, res) => {
  // TODO: Implement registration logic
  const { email, password, name } = req.body;
  
  // Validation, hashing, DB insert, token generation
  
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      userId: 'usr_123',
      email,
      token: 'jwt_token_here',
    },
  });
});

/**
 * POST /api/auth/login
 * Login user
 * 
 * Body: { email, password }
 * Success: 200 { success: true, data: { userId, email, accessToken, refreshToken } }
 * Error: 401 { success: false, error: { code, message } }
 */
app.post('/api/auth/login', (req, res) => {
  // TODO: Implement login logic
  const { email, password } = req.body;
  
  res.status(200).json({
    success: true,
    data: {
      userId: 'usr_123',
      email,
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      expiresIn: 3600,
    },
  });
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 * 
 * Body: { refreshToken }
 * Success: 200 { success: true, data: { accessToken } }
 * Error: 401 { success: false, error: { code, message } }
 */
app.post('/api/auth/refresh', (req, res) => {
  // TODO: Implement token refresh
  const { refreshToken } = req.body;
  
  res.status(200).json({
    success: true,
    data: {
      accessToken: 'new_access_token',
    },
  });
});

/**
 * POST /api/auth/logout
 * Logout user
 * 
 * Headers: Authorization: Bearer <token>
 * Success: 200 { success: true, message }
 * Error: 401 { success: false, error: { code, message } }
 */
app.post('/api/auth/logout', (req, res) => {
  // TODO: Implement logout (invalidate token)
  const authHeader = req.headers.authorization;
  
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

// ==========================================
// USER PROFILE ENDPOINTS
// ==========================================

/**
 * GET /api/user/profile
 * Get current user profile
 * 
 * Headers: Authorization: Bearer <token>
 * Success: 200 { success: true, data: { id, email, name, ... } }
 * Error: 401 { success: false, error: { code, message } }
 */
app.get('/api/user/profile', (req, res) => {
  // TODO: Implement get profile
  const authHeader = req.headers.authorization;
  
  res.status(200).json({
    success: true,
    data: {
      id: 'usr_123',
      email: 'user@test.com',
      name: 'Test User',
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  });
});

/**
 * PUT /api/user/profile
 * Update user profile
 * 
 * Headers: Authorization: Bearer <token>
 * Body: { name?, bio?, phone?, ... }
 * Success: 200 { success: true, data: { updated profile } }
 * Error: 400/401 { success: false, error: { code, message } }
 */
app.put('/api/user/profile', (req, res) => {
  // TODO: Implement update profile
  const updates = req.body;
  
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: 'usr_123',
      ...updates,
    },
  });
});

/**
 * DELETE /api/user/profile
 * Delete user account
 * 
 * Headers: Authorization: Bearer <token>
 * Success: 200 { success: true, message }
 * Error: 401 { success: false, error: { code, message } }
 */
app.delete('/api/user/profile', (req, res) => {
  // TODO: Implement account deletion
  
  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
});

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
    },
  });
});

export default app;

// Start server (if running directly)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
