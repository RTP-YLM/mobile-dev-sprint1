/**
 * Setup and Teardown Scripts for Tests
 * Handles test data initialization and cleanup
 */

const fs = require('fs');
const path = require('path');

class TestSetup {
  constructor() {
    this.testDataPath = path.join(__dirname, 'fixtures');
    this.createdUsers = [];
  }

  /**
   * Setup: Run before all tests
   */
  async beforeAll() {
    console.log('🚀 Setting up test environment...');
    
    // Load fixtures
    this.loadFixtures();
    
    // Initialize test database (if applicable)
    await this.initDatabase();
    
    // Seed test data
    await this.seedTestData();
    
    console.log('✅ Test environment ready!');
  }

  /**
   * Teardown: Run after all tests
   */
  async afterAll() {
    console.log('🧹 Cleaning up test environment...');
    
    // Remove test users created during tests
    await this.cleanupTestUsers();
    
    // Reset database to initial state
    await this.resetDatabase();
    
    // Clear temporary files
    this.clearTempFiles();
    
    console.log('✅ Cleanup completed!');
  }

  /**
   * Before each test
   */
  async beforeEach() {
    // Reset state between tests if needed
    this.currentTestData = {};
  }

  /**
   * After each test
   */
  async afterEach() {
    // Cleanup after individual test if needed
    if (this.currentTestData.createdUser) {
      this.createdUsers.push(this.currentTestData.createdUser);
    }
  }

  /**
   * Load test fixtures
   */
  loadFixtures() {
    try {
      this.users = JSON.parse(
        fs.readFileSync(path.join(this.testDataPath, 'users.json'), 'utf8')
      );
      this.tokens = JSON.parse(
        fs.readFileSync(path.join(this.testDataPath, 'tokens.json'), 'utf8')
      );
      console.log('📦 Fixtures loaded');
    } catch (error) {
      console.error('❌ Error loading fixtures:', error.message);
      throw error;
    }
  }

  /**
   * Initialize test database
   */
  async initDatabase() {
    // TODO: Replace with actual database initialization
    console.log('🗄️  Initializing test database...');
    
    // Example: Connect to test DB
    // await db.connect(process.env.TEST_DB_URL);
    
    return Promise.resolve();
  }

  /**
   * Seed test data
   */
  async seedTestData() {
    console.log('🌱 Seeding test data...');
    
    // TODO: Replace with actual seeding logic
    // Example: Insert valid test users
    for (const user of this.users.validUsers) {
      // await db.users.create(user);
      console.log(`  - Created user: ${user.email}`);
    }
    
    return Promise.resolve();
  }

  /**
   * Cleanup test users
   */
  async cleanupTestUsers() {
    console.log('🗑️  Removing test users...');
    
    // Delete all users with @test.com domain
    const testDomain = '@test.com';
    
    // TODO: Replace with actual deletion logic
    // await db.users.deleteMany({ email: { $regex: testDomain } });
    
    console.log(`  - Removed ${this.createdUsers.length} test users`);
    
    return Promise.resolve();
  }

  /**
   * Reset database to clean state
   */
  async resetDatabase() {
    console.log('🔄 Resetting database...');
    
    // TODO: Replace with actual reset logic
    // await db.dropDatabase();
    // await db.migrate();
    
    return Promise.resolve();
  }

  /**
   * Clear temporary files
   */
  clearTempFiles() {
    const tempDir = path.join(__dirname, 'temp');
    
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('📂 Temporary files cleared');
    }
  }

  /**
   * Get test user by email
   */
  getTestUser(email) {
    return this.users.validUsers.find(u => u.email === email) ||
           this.users.newUsers.find(u => u.email === email);
  }

  /**
   * Get mock token
   */
  getMockToken(type = 'accessToken') {
    return this.tokens.validTokens[type];
  }

  /**
   * Create unique test email
   */
  createTestEmail(prefix = 'test') {
    return `${prefix}.${Date.now()}@test.com`;
  }

  /**
   * Wait for async operations
   */
  async waitFor(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
const testSetup = new TestSetup();

module.exports = {
  testSetup,
  beforeAll: () => testSetup.beforeAll(),
  afterAll: () => testSetup.afterAll(),
  beforeEach: () => testSetup.beforeEach(),
  afterEach: () => testSetup.afterEach(),
};
