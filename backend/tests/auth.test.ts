/**
 * Authentication API Tests
 * Test Coverage: Register, Login, Refresh Token, Logout
 * Priority: P0 - Critical
 */

import request from 'supertest';
import { validUsers, newUsers, invalidUsers, securityTests } from '../../tests/fixtures/users.json';
import { mockResponses } from '../../tests/fixtures/tokens.json';

// Mock the Express app (replace with your actual app import)
const app = {
  post: jest.fn(),
  get: jest.fn(),
  use: jest.fn(),
};

// Mock API base URL
const API_URL = process.env.API_URL || 'http://localhost:3000';

describe('AUTH API - Registration', () => {
  describe('POST /api/auth/register - Happy Path', () => {
    test('[TC-REG-001] Should register new user successfully', async () => {
      const newUser = newUsers[0];
      
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: newUser.email,
          password: newUser.password,
          name: newUser.name,
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data).toHaveProperty('email', newUser.email);
      expect(response.body.data).toHaveProperty('token');
    });

    test('[TC-REG-006] Should handle special characters in email (+ tag)', async () => {
      const taggedUser = newUsers[2];
      
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: taggedUser.email,
          password: taggedUser.password,
          name: taggedUser.name,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/register - Error Cases', () => {
    test('[TC-REG-002] Should reject registration with existing email', async () => {
      const existingUser = invalidUsers.existingEmail;
      
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: existingUser.email,
          password: existingUser.password,
          name: 'Duplicate User',
        });

      expect(response.status).toBe(409); // Conflict
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toMatch(/already/i);
    });

    test('[TC-REG-003] Should reject weak password (too short)', async () => {
      const weakPass = invalidUsers.shortPassword;
      
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: weakPass.email,
          password: weakPass.password,
          name: 'Weak User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toMatch(/8 characters/i);
    });

    test('[TC-REG-004] Should reject password without special character', async () => {
      const noSpecial = invalidUsers.noSpecialChar;
      
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: noSpecial.email,
          password: noSpecial.password,
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toMatch(/special character/i);
    });

    test('[TC-REG-005] Should validate empty required fields', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: '',
          password: '',
          name: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toMatch(/required/i);
    });

    test('[TC-REG-007] Should reject invalid email format', async () => {
      const invalidEmail = invalidUsers.invalidEmail;
      
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: invalidEmail.email,
          password: 'Valid@123',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toMatch(/invalid email/i);
    });
  });

  describe('POST /api/auth/register - Security Tests', () => {
    test('[TC-REG-SEC-001] Should sanitize SQL injection in email', async () => {
      const sqlPayload = securityTests.sqlInjection[0];
      
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: sqlPayload,
          password: 'Test@1234',
          name: 'Hacker',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      // Should NOT expose database errors
      expect(response.body.error.message).not.toMatch(/SQL|database|syntax/i);
    });

    test('[TC-REG-SEC-002] Should sanitize XSS in name field', async () => {
      const xssPayload = securityTests.xssTests[0];
      
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: 'xss@test.com',
          password: 'Test@1234',
          name: xssPayload,
        });

      // Should either reject or sanitize
      if (response.status === 201) {
        expect(response.body.data.name).not.toContain('<script>');
      } else {
        expect(response.status).toBe(400);
      }
    });
  });
});

describe('AUTH API - Login', () => {
  describe('POST /api/auth/login - Happy Path', () => {
    test('[TC-LOGIN-001] Should login with valid credentials', async () => {
      const user = validUsers[0];
      
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data.email).toBe(user.email);
    });
  });

  describe('POST /api/auth/login - Error Cases', () => {
    test('[TC-LOGIN-002] Should reject invalid password', async () => {
      const user = validUsers[0];
      
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toMatch(/invalid/i);
    });

    test('[TC-LOGIN-003] Should reject non-existent user (without revealing)', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: 'ghost@test.com',
          password: 'Test@1234',
        });

      expect(response.status).toBe(401);
      // Should NOT reveal whether user exists
      expect(response.body.error.message).toMatch(/invalid email or password/i);
      expect(response.body.error.message).not.toMatch(/not found|doesn't exist/i);
    });

    test('[TC-LOGIN-004] Should validate empty credentials', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toMatch(/required/i);
    });

    test('[TC-LOGIN-006] Should reject login for inactive users', async () => {
      const inactiveUser = validUsers[2]; // qa.inactive@test.com
      
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: inactiveUser.email,
          password: inactiveUser.password,
        });

      expect(response.status).toBe(403);
      expect(response.body.error.message).toMatch(/inactive|disabled/i);
    });
  });

  describe('POST /api/auth/login - Security Tests', () => {
    test('[TC-LOGIN-005] Should prevent SQL injection attacks', async () => {
      const sqlPayload = securityTests.sqlInjection[0];
      
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: sqlPayload,
          password: 'anything',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      // Should NOT bypass authentication
      expect(response.body).not.toHaveProperty('accessToken');
    });
  });
});

describe('AUTH API - Token Refresh', () => {
  describe('POST /api/auth/refresh - Happy Path', () => {
    test('[TC-REFRESH-001] Should refresh access token with valid refresh token', async () => {
      // First login to get tokens
      const user = validUsers[0];
      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      const refreshToken = loginResponse.body.data.refreshToken;

      // Then refresh
      const response = await request(API_URL)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.accessToken).not.toBe(loginResponse.body.data.accessToken);
    });
  });

  describe('POST /api/auth/refresh - Error Cases', () => {
    test('[TC-REFRESH-002] Should reject expired refresh token', async () => {
      const expiredToken = 'expired.refresh.token';
      
      const response = await request(API_URL)
        .post('/api/auth/refresh')
        .send({ refreshToken: expiredToken });

      expect(response.status).toBe(401);
      expect(response.body.error.message).toMatch(/expired|invalid/i);
    });

    test('[TC-REFRESH-003] Should reject invalid token format', async () => {
      const response = await request(API_URL)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.error.message).toMatch(/invalid/i);
    });
  });
});

describe('AUTH API - Logout', () => {
  describe('POST /api/auth/logout - Happy Path', () => {
    test('[TC-LOGOUT-001] Should logout successfully', async () => {
      // First login
      const user = validUsers[0];
      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      const accessToken = loginResponse.body.data.accessToken;

      // Then logout
      const response = await request(API_URL)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/logout/i);
    });

    test('[TC-LOGOUT-002] Should invalidate token after logout', async () => {
      // Login
      const user = validUsers[0];
      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      const accessToken = loginResponse.body.data.accessToken;

      // Logout
      await request(API_URL)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      // Try to use token after logout
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout - Error Cases', () => {
    test('[TC-LOGOUT-003] Should reject logout without token', async () => {
      const response = await request(API_URL)
        .post('/api/auth/logout')
        .send();

      expect(response.status).toBe(401);
      expect(response.body.error.message).toMatch(/unauthorized|token required/i);
    });
  });
});
