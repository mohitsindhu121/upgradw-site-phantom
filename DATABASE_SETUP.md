# 🗄️ Mohit Corporation Database Setup Guide

## Quick Setup (3 Steps)

### Step 1: Set Your Database URL
Create a `.env` file in your project root and add your database URL:

```bash
# Copy the example file
cp .env.example .env

# Edit .env file with your database URL
DATABASE_URL=postgresql://your_username:your_password@your_host:5432/your_database
```

### Step 2: Run Database Setup
```bash
# Setup all tables automatically
node setup-database.js
```

### Step 3: Start Your Application
```bash
npm run dev
```

## 📊 Database Providers Supported

### PostgreSQL (Local)
```
DATABASE_URL=postgresql://username:password@localhost:5432/mohit_corp
```

### Neon (Serverless PostgreSQL)
```
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb
```

### Supabase
```
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### Railway
```
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

## 🛠️ Manual Database Setup

If you prefer to create tables manually, here are the SQL commands:

```sql
-- Users table
CREATE TABLE "users" (
  "id" varchar PRIMARY KEY,
  "email" varchar UNIQUE,
  "first_name" varchar,
  "last_name" varchar,
  "profile_image_url" varchar,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Products table
CREATE TABLE "products" (
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

-- YouTube resources table
CREATE TABLE "youtube_resources" (
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

-- Contact messages table
CREATE TABLE "contact_messages" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "is_read" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now()
);

-- Session table
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");
CREATE INDEX "IDX_session_expire" ON "session" ("expire");
```

## 🔧 Troubleshooting

### Connection Issues
- Check your database URL format
- Ensure your database server is running
- Verify your credentials are correct

### Permission Issues
- Make sure your database user has CREATE TABLE permissions
- Check if your database exists

### SSL Issues (for cloud databases)
If you get SSL errors, add `?sslmode=require` to your database URL:
```
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

## 🎮 Admin Panel Access

After setup, you can access the admin panel with:
- **Username:** mohit
- **Password:** 1

Navigate to `/login` to access the admin panel and manage your products and YouTube content.

## 📞 Support

If you need help with database setup, contact the development team or check the application logs for detailed error messages.