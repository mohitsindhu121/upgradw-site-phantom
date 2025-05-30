-- Mohit Corporation Database Schema Export
-- Complete schema for permanent database setup

-- Users table with comprehensive seller information
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY NOT NULL,
  username VARCHAR UNIQUE,
  password VARCHAR,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  google_id VARCHAR UNIQUE,
  role VARCHAR DEFAULT 'user',
  is_verified BOOLEAN DEFAULT false,
  store_name VARCHAR,
  store_description TEXT,
  phone_number VARCHAR,
  address TEXT,
  city VARCHAR,
  state VARCHAR,
  country VARCHAR DEFAULT 'India',
  pincode VARCHAR,
  business_type VARCHAR,
  gst_number VARCHAR,
  pan_number VARCHAR,
  bank_account_number VARCHAR,
  bank_ifsc_code VARCHAR,
  bank_name VARCHAR,
  specialization TEXT,
  experience VARCHAR,
  portfolio TEXT,
  social_media_links TEXT,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR,
  video_url VARCHAR,
  is_active BOOLEAN DEFAULT true,
  owner_id VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- YouTube resources table
CREATE TABLE IF NOT EXISTS youtube_resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_url VARCHAR NOT NULL,
  thumbnail_url VARCHAR,
  category VARCHAR(50) NOT NULL,
  duration VARCHAR,
  views VARCHAR,
  is_active BOOLEAN DEFAULT true,
  owner_id VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_products_owner ON products(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_youtube_owner ON youtube_resources(owner_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);

-- Insert default admin user (Mohit)
INSERT INTO users (
  id, username, email, role, is_verified, is_active, created_at
) VALUES (
  'mohit', 'mohit', 'mohit@phantomscorp.com', 'admin', true, true, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;