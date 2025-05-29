import { db } from "./db";
import { sql } from "drizzle-orm";

export async function fixDatabaseSchema() {
  try {
    // Add currency column to products table
    await db.execute(sql`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS currency varchar(3) DEFAULT 'INR'
    `);
    
    console.log('✅ Database schema updated successfully');
  } catch (error) {
    console.error('Database schema update error:', error);
  }
}