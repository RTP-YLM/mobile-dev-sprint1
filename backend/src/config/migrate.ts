import { pool } from './database';

const migrations = [
  // Migration 001: Create users table
  `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);
  `,

  // Migration 002: Create refresh_tokens table
  `
  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL
  );

  CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
  CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
  CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
  `,

  // Migration 003: Create migrations tracking table
  `
  CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `,
];

const migrationNames = [
  '001_create_users_table',
  '002_create_refresh_tokens_table',
  '003_create_migrations_table',
];

export const runMigrations = async (): Promise<void> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if migrations table exists (if not, first migration will create it)
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'migrations'
      );
    `);
    
    const migrationsTableExists = checkTable.rows[0].exists;
    
    for (let i = 0; i < migrations.length; i++) {
      const migrationName = migrationNames[i];
      
      // Skip if already applied
      if (migrationsTableExists) {
        const checkMigration = await client.query(
          'SELECT 1 FROM migrations WHERE name = $1',
          [migrationName]
        );
        if (checkMigration.rowCount && checkMigration.rowCount > 0) {
          console.log(`Migration ${migrationName} already applied, skipping...`);
          continue;
        }
      }
      
      console.log(`Applying migration: ${migrationName}...`);
      await client.query(migrations[i]);
      
      // Record migration
      await client.query(
        'INSERT INTO migrations (name) VALUES ($1)',
        [migrationName]
      );
      
      console.log(`Migration ${migrationName} applied successfully`);
    }
    
    await client.query('COMMIT');
    console.log('All migrations completed successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
  }
};

export const rollbackMigration = async (migrationName: string): Promise<void> => {
  // Implement rollback logic if needed
  console.log(`Rollback for ${migrationName} not implemented`);
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}