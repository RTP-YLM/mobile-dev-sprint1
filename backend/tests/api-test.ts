/**
 * API Test Script
 * Run with: npm run test:api
 * 
 * This script tests all authentication endpoints
 */

import axios, { AxiosError } from 'axios';

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  success: boolean;
  status?: number;
  data?: any;
  error?: string;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken: string | null = null;
let refreshToken: string | null = null;

async function runTest(name: string, testFn: () => Promise<void>): Promise<TestResult> {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    await testFn();
    console.log(`✅ PASSED: ${name}`);
    return { name, success: true };
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMsg = axiosError.response?.data?.message || axiosError.message;
    console.error(`❌ FAILED: ${name}`);
    console.error(`   Error: ${errorMsg}`);
    return { 
      name, 
      success: false, 
      status: axiosError.response?.status,
      error: errorMsg 
    };
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  const response = await api.get('/api/health');
  if (!response.data.success) throw new Error('Health check failed');
  console.log('   Server status:', response.data.data.status);
}

// Test 2: Register User
async function testRegister() {
  const testEmail = `test_${Date.now()}@example.com`;
  const response = await api.post('/api/auth/register', {
    email: testEmail,
    password: 'TestPass123!',
    firstName: 'Test',
    lastName: 'User',
  });
  
  if (!response.data.success) throw new Error('Registration failed');
  
  accessToken = response.data.data.tokens.accessToken;
  refreshToken = response.data.data.tokens.refreshToken;
  
  console.log('   User ID:', response.data.data.user.id);
  console.log('   Email:', response.data.data.user.email);
  console.log('   Access Token received:', !!accessToken);
  console.log('   Refresh Token received:', !!refreshToken);
}

// Test 3: Register with existing email (should fail)
async function testRegisterDuplicate() {
  try {
    await api.post('/api/auth/register', {
      email: 'test@example.com',
      password: 'TestPass123!',
    });
    throw new Error('Should have failed with duplicate email');
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status !== 409) {
      throw error;
    }
    console.log('   Correctly rejected duplicate email');
  }
}

// Test 4: Register with weak password (should fail)
async function testRegisterWeakPassword() {
  try {
    await api.post('/api/auth/register', {
      email: 'weak@test.com',
      password: '123',
    });
    throw new Error('Should have failed with weak password');
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status !== 400) {
      throw error;
    }
    console.log('   Correctly rejected weak password');
  }
}

// Test 5: Login
async function testLogin() {
  // First register a user to login
  const testEmail = `login_test_${Date.now()}@example.com`;
  await api.post('/api/auth/register', {
    email: testEmail,
    password: 'TestPass123!',
  });
  
  const response = await api.post('/api/auth/login', {
    email: testEmail,
    password: 'TestPass123!',
  });
  
  if (!response.data.success) throw new Error('Login failed');
  
  accessToken = response.data.data.tokens.accessToken;
  refreshToken = response.data.data.tokens.refreshToken;
  
  console.log('   Login successful');
  console.log('   Access Token received:', !!accessToken);
}

// Test 6: Login with wrong password (should fail)
async function testLoginWrongPassword() {
  try {
    await api.post('/api/auth/login', {
      email: 'test@example.com',
      password: 'WrongPass123!',
    });
    throw new Error('Should have failed with wrong password');
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status !== 401) {
      throw error;
    }
    console.log('   Correctly rejected wrong password');
  }
}

// Test 7: Get Profile (requires auth)
async function testGetProfile() {
  if (!accessToken) {
    throw new Error('No access token available');
  }
  
  const response = await api.get('/api/users/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  if (!response.data.success) throw new Error('Get profile failed');
  console.log('   Profile retrieved:', response.data.data.user.email);
}

// Test 8: Get Profile without auth (should fail)
async function testGetProfileNoAuth() {
  try {
    await api.get('/api/users/me');
    throw new Error('Should have failed without auth');
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status !== 401) {
      throw error;
    }
    console.log('   Correctly rejected unauthorized request');
  }
}

// Test 9: Update Profile
async function testUpdateProfile() {
  if (!accessToken) {
    throw new Error('No access token available');
  }
  
  const response = await api.put('/api/users/me', {
    firstName: 'Updated',
    lastName: 'Name',
  }, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  if (!response.data.success) throw new Error('Update profile failed');
  console.log('   Updated name:', response.data.data.user.firstName, response.data.data.user.lastName);
}

// Test 10: Refresh Token
async function testRefreshToken() {
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await api.post('/api/auth/refresh', {
    refreshToken,
  });
  
  if (!response.data.success) throw new Error('Token refresh failed');
  
  accessToken = response.data.data.tokens.accessToken;
  refreshToken = response.data.data.tokens.refreshToken;
  
  console.log('   New access token received:', !!accessToken);
  console.log('   New refresh token received:', !!refreshToken);
}

// Test 11: Logout
async function testLogout() {
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await api.post('/api/auth/logout', {
    refreshToken,
  });
  
  if (!response.data.success) throw new Error('Logout failed');
  console.log('   Logout successful');
}

// Test 12: Use revoked refresh token (should fail)
async function testRevokedToken() {
  if (!refreshToken) {
    console.log('   Skipping: No refresh token to test');
    return;
  }
  
  try {
    await api.post('/api/auth/refresh', {
      refreshToken,
    });
    throw new Error('Should have failed with revoked token');
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status !== 401) {
      throw error;
    }
    console.log('   Correctly rejected revoked token');
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('       Authentication API Test Suite - Sprint 1    ');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Testing against: ${BASE_URL}`);
  
  const results: TestResult[] = [];
  
  // Run all tests
  results.push(await runTest('Health Check', testHealthCheck));
  results.push(await runTest('Register User', testRegister));
  results.push(await runTest('Register Duplicate Email (should fail)', testRegisterDuplicate));
  results.push(await runTest('Register Weak Password (should fail)', testRegisterWeakPassword));
  results.push(await runTest('Login', testLogin));
  results.push(await runTest('Login Wrong Password (should fail)', testLoginWrongPassword));
  results.push(await runTest('Get Profile', testGetProfile));
  results.push(await runTest('Get Profile No Auth (should fail)', testGetProfileNoAuth));
  results.push(await runTest('Update Profile', testUpdateProfile));
  results.push(await runTest('Refresh Token', testRefreshToken));
  results.push(await runTest('Logout', testLogout));
  results.push(await runTest('Use Revoked Token (should fail)', testRevokedToken));
  
  // Summary
  console.log('\n═══════════════════════════════════════════════════');
  console.log('                    Test Summary                   ');
  console.log('═══════════════════════════════════════════════════');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  results.forEach(r => {
    const icon = r.success ? '✅' : '❌';
    console.log(`${icon} ${r.name}`);
  });
  
  console.log('\n───────────────────────────────────────────────────');
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('═══════════════════════════════════════════════════\n');
  
  if (failed > 0) {
    process.exit(1);
  }
}

// Install axios if not available
try {
  require.resolve('axios');
  runAllTests();
} catch (e) {
  console.log('Please install axios: npm install axios');
  process.exit(1);
}