import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Required for Neon
});

// Test the connection on startup
pool.query('SELECT NOW()')
  .then(() => console.log('Connected to Neon PostgreSQL'))
  .catch(err => console.error('Database connection error:', err));

export default pool;
