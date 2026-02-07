// Global test setup
require('dotenv').config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DB_NAME = 'test_db';

// Global test timeout
jest.setTimeout(10000);

// Mock console.error to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Cleanup after all tests
afterAll(async () => {
  // Add cleanup logic here (close DB connections, etc.)
  await new Promise(resolve => setTimeout(() => resolve(), 500));
});
