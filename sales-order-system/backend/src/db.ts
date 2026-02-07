import { Pool } from 'pg';

// Database connection pool
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'sales_order',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
});

// Helper function
export const query = (text: string, params?: any[]) => pool.query(text, params);
