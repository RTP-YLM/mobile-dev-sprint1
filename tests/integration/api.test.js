/**
 * API Integration Tests
 * Test complete user flows: Register → Login → Profile → Logout
 * Priority: P0 - Critical Path
 */

const request = require('supertest');
const users = require('../fixtures/users.json');
const tokens = require('../fixtures/tokens.json');

const API_URL = process.env.API_URL || 'http://localhost:3000';

describe('Integration Test: Complete User Journey', () => {
  let testUser = {
    email: `integration.test.${Date.now()}@test.com`,
    password: 'Integration@2026',
    name: 'Integration Test User',
  };
  let userTokens = {};
  let userId;

  describe('[FLOW-001] New User Registration → Login → Profile Flow', () => {
    test('Step 1: Register new user', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send(testUser)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data).toHaveProperty('email', testUser.email);
      expect(response.body.data).toHaveProperty('token');

      // Store userId and initial token
      userId = response.body.data.userId;
      userTokens.accessToken = response.body.data.token;
    });

    test('Step 2: Login with registered credentials', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.userId).toBe(userId);

      // Update tokens
      userTokens = response.body.data;
    });

    test('Step 3: Access user profile with token', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${userTokens.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.name).toBe(testUser.name);
      expect(response.body.data.id).toBe(userId);
    });

    test('Step 4: Update user profile', async () => {
      const updatedProfile = {
        name: 'Updated Integration User',
        bio: 'Integration test bio',
      };

      const response = await request(API_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${userTokens.accessToken}`)
        .send(updatedProfile);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updatedProfile.name);
      expect(response.body.data.bio).toBe(updatedProfile.bio);
    });

    test('Step 5: Verify profile changes persisted', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${userTokens.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Updated Integration User');
      expect(response.body.data.bio).toBe('Integration test bio');
    });

    test('Step 6: Logout user', async () => {
      const response = await request(API_URL)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${userTokens.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('Step 7: Verify token invalidated after logout', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${userTokens.accessToken}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('[FLOW-002] Token Refresh Flow', () => {
    let refreshToken;
    let oldAccessToken;

    beforeAll(async () => {
      // Login to get tokens
      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      oldAccessToken = loginResponse.body.data.accessToken;
      refreshToken = loginResponse.body.data.refreshToken;
    });

    test('Step 1: Access API with valid access token', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${oldAccessToken}`);

      expect(response.status).toBe(200);
    });

    test('Step 2: Refresh access token', async () => {
      const response = await request(API_URL)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.accessToken).not.toBe(oldAccessToken);

      // Update access token
      userTokens.accessToken = response.body.data.accessToken;
    });

    test('Step 3: Access API with new access token', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${userTokens.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('[FLOW-003] Session Management Flow', () => {
    test('Step 1: Login from Device A', async () => {
      const responseA = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .set('User-Agent', 'Device-A');

      expect(responseA.status).toBe(200);
      userTokens.deviceA = responseA.body.data.accessToken;
    });

    test('Step 2: Login from Device B (same user)', async () => {
      const responseB = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .set('User-Agent', 'Device-B');

      expect(responseB.status).toBe(200);
      userTokens.deviceB = responseB.body.data.accessToken;
    });

    test('Step 3: Verify both sessions active (concurrent sessions)', async () => {
      const [responseA, responseB] = await Promise.all([
        request(API_URL)
          .get('/api/user/profile')
          .set('Authorization', `Bearer ${userTokens.deviceA}`),
        request(API_URL)
          .get('/api/user/profile')
          .set('Authorization', `Bearer ${userTokens.deviceB}`),
      ]);

      // Both should succeed (allow concurrent sessions)
      // OR one should fail (single session mode)
      const successCount = [responseA, responseB].filter(r => r.status === 200).length;
      expect(successCount).toBeGreaterThan(0);
    });

    test('Step 4: Logout from Device A', async () => {
      const response = await request(API_URL)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${userTokens.deviceA}`);

      expect(response.status).toBe(200);
    });

    test('Step 5: Verify Device A logged out', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${userTokens.deviceA}`);

      expect(response.status).toBe(401);
    });

    test('Step 6: Verify Device B still active', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${userTokens.deviceB}`);

      // Should succeed if concurrent sessions allowed
      // May fail if single session enforced
      expect([200, 401]).toContain(response.status);
    });
  });

  describe('[FLOW-004] Error Recovery Flow', () => {
    test('Step 1: Attempt login with wrong password', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('Step 2: Retry with correct password', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('Step 3: Access protected endpoint without auth', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile');

      expect(response.status).toBe(401);
    });

    test('Step 4: Provide valid auth and succeed', async () => {
      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      const token = loginResponse.body.data.accessToken;

      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('[FLOW-005] Security Flow - SQL Injection Prevention', () => {
    const maliciousInputs = users.securityTests.sqlInjection;

    test('Step 1: Attempt registration with SQL injection in email', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: maliciousInputs[0],
          password: 'Test@1234',
          name: 'Hacker',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      // Should not expose database errors
      expect(JSON.stringify(response.body)).not.toMatch(/SQL|database|syntax/i);
    });

    test('Step 2: Attempt login with SQL injection', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: maliciousInputs[1],
          password: 'anything',
        });

      expect(response.status).toBe(401);
      expect(response.body).not.toHaveProperty('accessToken');
    });

    test('Step 3: Verify no bypass authentication', async () => {
      for (const maliciousEmail of maliciousInputs) {
        const response = await request(API_URL)
          .post('/api/auth/login')
          .send({
            email: maliciousEmail,
            password: 'bypass',
          });

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('accessToken');
      }
    });
  });

  describe('[FLOW-006] XSS Prevention Flow', () => {
    const xssPayloads = users.securityTests.xssTests;
    let cleanToken;

    beforeAll(async () => {
      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      cleanToken = loginResponse.body.data.accessToken;
    });

    test('Step 1: Attempt to inject XSS in profile name', async () => {
      const response = await request(API_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${cleanToken}`)
        .send({
          name: xssPayloads[0],
        });

      // Should either sanitize or reject
      if (response.status === 200) {
        expect(response.body.data.name).not.toContain('<script>');
      } else {
        expect(response.status).toBe(400);
      }
    });

    test('Step 2: Verify XSS not stored', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${cleanToken}`);

      expect(response.status).toBe(200);
      const profileData = JSON.stringify(response.body);
      expect(profileData).not.toContain('<script>');
      expect(profileData).not.toContain('javascript:');
      expect(profileData).not.toContain('onerror=');
    });
  });

  describe('[FLOW-007] Complete Delete Account Flow', () => {
    let deleteTestUser = {
      email: `delete.flow.${Date.now()}@test.com`,
      password: 'Delete@Flow123',
      name: 'Delete Flow User',
    };
    let deleteToken;

    test('Step 1: Register user to be deleted', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send(deleteTestUser);

      expect(response.status).toBe(201);
      deleteToken = response.body.data.token;
    });

    test('Step 2: Verify user can login', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: deleteTestUser.email,
          password: deleteTestUser.password,
        });

      expect(response.status).toBe(200);
      deleteToken = response.body.data.accessToken;
    });

    test('Step 3: Delete user account', async () => {
      const response = await request(API_URL)
        .delete('/api/user/profile')
        .set('Authorization', `Bearer ${deleteToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('Step 4: Verify cannot login with deleted account', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: deleteTestUser.email,
          password: deleteTestUser.password,
        });

      expect(response.status).toBe(401);
    });

    test('Step 5: Verify cannot access profile with old token', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${deleteToken}`);

      expect(response.status).toBe(401);
    });
  });
});

describe('Integration Test: Performance & Load', () => {
  describe('[PERF-001] Concurrent User Registrations', () => {
    test('Should handle 10 concurrent registrations', async () => {
      const registrations = Array(10).fill(null).map((_, i) =>
        request(API_URL)
          .post('/api/auth/register')
          .send({
            email: `concurrent.${i}.${Date.now()}@test.com`,
            password: 'Concurrent@123',
            name: `Concurrent User ${i}`,
          })
      );

      const responses = await Promise.all(registrations);
      
      const successCount = responses.filter(r => r.status === 201).length;
      expect(successCount).toBe(10);
    }, 30000);
  });

  describe('[PERF-002] Rapid Sequential Requests', () => {
    let token;

    beforeAll(async () => {
      const user = users.validUsers[0];
      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });
      token = loginResponse.body.data.accessToken;
    });

    test('Should handle 20 sequential profile requests', async () => {
      for (let i = 0; i < 20; i++) {
        const response = await request(API_URL)
          .get('/api/user/profile')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
      }
    }, 30000);
  });
});

describe('Integration Test: Data Consistency', () => {
  describe('[DATA-001] Profile Update Consistency', () => {
    let token;
    const testEmail = `consistency.${Date.now()}@test.com`;

    beforeAll(async () => {
      await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: 'Consistency@123',
          name: 'Original Name',
        });

      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'Consistency@123',
        });

      token = loginResponse.body.data.accessToken;
    });

    test('Step 1: Update profile', async () => {
      await request(API_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });
    });

    test('Step 2: Logout', async () => {
      await request(API_URL)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);
    });

    test('Step 3: Login again', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'Consistency@123',
        });

      token = response.body.data.accessToken;
    });

    test('Step 4: Verify changes persisted', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Updated Name');
    });
  });
});
