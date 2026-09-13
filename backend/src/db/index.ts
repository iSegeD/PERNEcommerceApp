import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 1500,
});

export const checkDatabaseHealth = async (): Promise<void> => {
  const client = await pool.connect();

  let failed = false;

  try {
    const query: pg.QueryConfig & { query_timeout: number } = {
      text: 'SELECT 1',
      query_timeout: 1500,
    };

    await client.query(query);
  } catch (error: unknown) {
    failed = true;
    throw error;
  } finally {
    client.release(failed);
  }
};

export const db = drizzle(pool, { schema });
