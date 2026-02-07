import { Pool, PoolConfig, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'auth_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async <T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rowCount });
  return result;
};

export const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  
  // @ts-ignore - monkey patch for logging
  client.query = async (...args: any[]) => {
    const start = Date.now();
    // @ts-ignore
    const result = await originalQuery.apply(client, args);
    const duration = Date.now() - start;
    console.log('Executed query', { text: args[0].substring(0, 50), duration });
    return result;
  };
  
  return client;
};

export const closePool = async () => {
  await pool.end();
};