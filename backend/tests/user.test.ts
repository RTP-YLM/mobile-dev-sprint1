/**
 * User API Tests
 * Test Coverage: Get Profile, Update Profile
 * Priority: P0-P1
 */

import request from 'supertest';
import { validUsers } from '../../tests/fixtures/users.json';

const API_URL = process.env.API_URL || 'http://localhost:3000';

// Helper function to get authentication token
async function getAuthToken(email: string, password: string): Promise<string> {
  const response = await request(API_URL)
    .post('/api/auth/login')
    .send({ email, password });
  
  return response.body.data.accessToken;
}

describe('USER API - Profile Management', () => {
  let authToken: string;
  const testUser = validUsers[0];

  beforeEach(async () => {
    // Login before each test to get fresh token
    authToken = await getAuthToken(testUser.email, testUser.password);
  });

  describe('GET /api/user/profile - Happy Path', () => {
    test('[TC-PROFILE-001] Should get user profile successfully', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('email', testUser.email);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('createdAt');
      // Should NOT return password
      expect(response.body.data).not.toHaveProperty('password');
      expect(response.body.data).not.toHaveProperty('passwordHash');
    });

    test('[TC-PROFILE-005] Should return all expected profile fields', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('role');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('createdAt');
    });
  });

  describe('GET /api/user/profile - Error Cases', () => {
    test('[TC-PROFILE-006] Should reject request without authentication token', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toMatch(/unauthorized|authentication required/i);
    });

    test('[TC-PROFILE-007] Should reject request with invalid token', async () => {
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
      expect(response.body.error.message).toMatch(/invalid|unauthorized/i);
    });

    test('[TC-PROFILE-008] Should reject expired token', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired.token';
      
      const response = await request(API_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('TOKEN_EXPIRED');
    });
  });

  describe('PUT /api/user/profile - Happy Path', () => {
    test('[TC-PROFILE-002] Should update profile successfully', async () => {
      const updatedData = {
        name: 'Updated QA User',
        bio: 'This is a test bio for QA purposes',
      };

      const response = await request(API_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/updated/i);
      expect(response.body.data.name).toBe(updatedData.name);
      expect(response.body.data.bio).toBe(updatedData.bio);
    });

    test('[TC-PROFILE-009] Should update only provided fields', async () => {
      const response = await request(API_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'New Name Only' });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('New Name Only');
      // Other fields should remain unchanged
      expect(response.body.data.email).toBe(testUser.email);
    });

    test('[TC-PROFILE-010] Should handle Unicode characters in name', async () => {
      const response = await request(API_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'ผู้ใช้ทดสอบ QA' });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('ผู้ใช้ทดสอบ QA');
    });
  });

  describe('PUT /api/user/profile - Error Cases', () => {
    test('[TC-PROFILE-003] Should reject empty required fields', async () => {
      const response = await request(API_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: '' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toMatch(/name.*required/i);
    });

    test('[TC-PROFILE-011] Should reject name that is too short', async () => {
      const response = await request(API_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'A' });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toMatch(/2.*characters/i);
    });

    test('[TC-PROFILE-012] Should reject invalid phone format', async () => {
      const response = await request(API_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ phone: 'invalid-phone-123' });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toMatch(/invalid phone/i);
    });

    test('[TC-PROFILE-013] Should not allow updating email through profile endpoint', async () => {
      const response = await request(API_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'newemail@test.com' });

      // Should either ignore or reject email updates
      expect([200, 400, 403]).toContain(response.status);
      
      if (response.status === 200) {
        // If accepted, email should NOT be changed
        expect(response.body.data.email).toBe(testUser.email);
      }
    });
  });

  describe('DELETE /api/user/profile - Account Deletion', () => {
    test('[TC-PROFILE-014] Should delete account successfully', async () => {
      // Create a new user for deletion test
      const newUser = {
        email: 'delete-me@test.com',
        password: 'Delete@123',
        name: 'To Be Deleted',
      };

      await request(API_URL)
        .post('/api/auth/register')
        .send(newUser);

      const token = await getAuthToken(newUser.email, newUser.password);

      const response = await request(API_URL)
        .delete('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/deleted|removed/i);

      // Verify cannot login with deleted account
      const loginAttempt = await request(API_URL)
        .post('/api/auth/login')
        .send({ email: newUser.email, password: newUser.password });

      expect(loginAttempt.status).toBe(401);
    });
  });
});

describe('USER API - Security Tests', () => {
  let authToken: string;
  const testUser = validUsers[0];

  beforeEach(async () => {
    authToken = await getAuthToken(testUser.email, testUser.password);
  });

  describe('Authorization Checks', () => {
    test('[TC-SEC-001] Should not allow accessing other user\'s profile', async () => {
      const otherUserId = 'usr_999';
      
      const response = await request(API_URL)
        .get(`/api/user/${otherUserId}/profile`)
        .set('Authorization', `Bearer ${authToken}`);

      // Should either return 403 Forbidden or only show public data
      if (response.status === 200) {
        expect(response.body.data).not.toHaveProperty('email');
        expect(response.body.data).not.toHaveProperty('phone');
      } else {
        expect(response.status).toBe(403);
      }
    });

    test('[TC-SEC-002] Should sanitize XSS in profile updates', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      
      const response = await request(API_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ bio: xssPayload });

      if (response.status === 200) {
        // Should be sanitized
        expect(response.body.data.bio).not.toContain('<script>');
      } else {
        // Or rejected
        expect(response.status).toBe(400);
      }
    });
  });

  describe('Rate Limiting', () => {
    test('[TC-SEC-003] Should implement rate limiting on profile updates', async () => {
      const updates = Array(20).fill(null).map((_, i) => 
        request(API_URL)
          .put('/api/user/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: `Update ${i}` })
      );

      const responses = await Promise.all(updates);
      
      // At least one should be rate limited (429)
      const rateLimited = responses.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
    }, 15000); // Increase timeout for this test
  });
});

describe('USER API - Edge Cases', () => {
  let authToken: string;

  beforeEach(async () => {
    const testUser = validUsers[0];
    authToken = await getAuthToken(testUser.email, testUser.password);
  });

  test('[TC-EDGE-001] Should handle very long bio text', async () => {
    const longBio = 'A'.repeat(5000);
    
    const response = await request(API_URL)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ bio: longBio });

    // Should either accept (if within limits) or reject with clear error
    if (response.status === 400) {
      expect(response.body.error.message).toMatch(/too long|maximum/i);
    } else {
      expect(response.status).toBe(200);
    }
  });

  test('[TC-EDGE-002] Should handle special characters in name', async () => {
    const specialNames = [
      "O'Brien",
      "Jean-Paul",
      "Müller",
      "李明",
    ];

    for (const name of specialNames) {
      const response = await request(API_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe(name);
    }
  });

  test('[TC-EDGE-003] Should handle concurrent profile updates', async () => {
    const updates = [
      request(API_URL).put('/api/user/profile').set('Authorization', `Bearer ${authToken}`).send({ name: 'Update 1' }),
      request(API_URL).put('/api/user/profile').set('Authorization', `Bearer ${authToken}`).send({ name: 'Update 2' }),
      request(API_URL).put('/api/user/profile').set('Authorization', `Bearer ${authToken}`).send({ name: 'Update 3' }),
    ];

    const responses = await Promise.all(updates);
    
    // All should succeed (with last write wins) or proper conflict handling
    responses.forEach(response => {
      expect([200, 409]).toContain(response.status);
    });
  });
});
