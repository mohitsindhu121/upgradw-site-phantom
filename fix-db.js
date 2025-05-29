import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixDatabase() {
  try {
    // Add currency column if it doesn't exist
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS currency varchar(3) DEFAULT 'INR'
    `);
    console.log('✅ Currency column added successfully');
    
    // Add any missing columns to users table for seller functionality
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS google_id varchar UNIQUE,
      ADD COLUMN IF NOT EXISTS store_name varchar,
      ADD COLUMN IF NOT EXISTS store_description text,
      ADD COLUMN IF NOT EXISTS role varchar DEFAULT 'user',
      ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false
    `);
    console.log('✅ User table updated for seller functionality');
    
  } catch (error) {
    console.error('❌ Database fix failed:', error);
  } finally {
    await pool.end();
  }
}

fixDatabase();