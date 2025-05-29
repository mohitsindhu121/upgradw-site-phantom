#!/usr/bin/env node

// Database Setup Script for Phantoms Corporation
// This script will create all necessary tables in your database

import pkg from 'pg';
const { Pool } = pkg;

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL || 
  process.env.CUSTOM_DATABASE_URL || 
  "postgresql://username:password@hostname:port/database";

console.log('🚀 Starting Phantoms Corporation Database Setup...\n');

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const createTables = async () => {
  try {
    console.log('📊 Creating database tables...');

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" varchar PRIMARY KEY,
        "email" varchar UNIQUE,
        "first_name" varchar,
        "last_name" varchar,
        "profile_image_url" varchar,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `);
    console.log('✅ Users table created');

    // Products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "products" (
        "id" serial PRIMARY KEY,
        "product_id" varchar NOT NULL UNIQUE,
        "name" varchar(255) NOT NULL,
        "description" text,
        "price" decimal(10,2) NOT NULL,
        "category" varchar(50) NOT NULL,
        "image_url" varchar,
        "video_url" varchar,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `);
    console.log('✅ Products table created');

    // YouTube resources table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "youtube_resources" (
        "id" serial PRIMARY KEY,
        "title" varchar(255) NOT NULL,
        "description" text,
        "youtube_url" varchar NOT NULL,
        "thumbnail_url" varchar,
        "category" varchar(50) NOT NULL,
        "duration" varchar,
        "views" varchar,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `);
    console.log('✅ YouTube resources table created');

    // Contact messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "contact_messages" (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "message" text NOT NULL,
        "is_read" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now()
      );
    `);
    console.log('✅ Contact messages table created');

    // Session table (for authentication)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
      );
    `);
    
    await pool.query(`
      ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    console.log('✅ Session table created');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('📋 Tables created:');
    console.log('   - users');
    console.log('   - products');
    console.log('   - youtube_resources');
    console.log('   - contact_messages');
    console.log('   - session');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
};

// Run the setup
createTables()
  .then(() => {
    console.log('\n✨ Your Phantoms Corporation database is ready!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Setup failed:', error.message);
    console.log('\n💡 Make sure your DATABASE_URL is correct in environment variables');
    process.exit(1);
  });