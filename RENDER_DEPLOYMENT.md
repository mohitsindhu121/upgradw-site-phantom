# Render Deployment Guide for Mohit Corporation

## Pre-Deployment Setup

### 1. Build Script Configuration
Ensure package.json has proper build scripts:

```json
{
  "scripts": {
    "build": "vite build",
    "start": "NODE_ENV=production tsx server/index.ts",
    "dev": "NODE_ENV=development tsx server/index.ts"
  }
}
```

### 2. Environment Variables for Render

Copy these exact values to Render Environment Variables:

```
DATABASE_URL=postgresql://mohit_owner:npg_47yoWupTxNBs@ep-gentle-glade-a8imzvfp-pooler.eastus2.azure.neon.tech/mohit?sslmode=require
PGHOST=ep-gentle-glade-a8imzvfp-pooler.eastus2.azure.neon.tech
PGPORT=5432
PGUSER=mohit_owner
PGPASSWORD=npg_47yoWupTxNBs
PGDATABASE=mohit
VITE_FIREBASE_API_KEY=AIzaSyD0wKEUZfyQHNkUN7R-zS_25zU8UoLEiAU
VITE_FIREBASE_PROJECT_ID=phantom-site-e226f
VITE_FIREBASE_APP_ID=1:147758091170:web:6aac2a67d75ed92ecbc0fb
GROQ_API_KEY=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
NODE_ENV=production
PORT=10000
SESSION_SECRET=mohit-corp-secret-2024
```

## Render Deployment Steps

### 1. Create Web Service
- Go to render.com
- Connect your GitHub repository
- Select "Web Service"

### 2. Configuration Settings
- **Name**: mohit-corporation
- **Branch**: main
- **Root Directory**: . (leave empty)
- **Runtime**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

### 3. Environment Variables
- Add all variables from above list
- Make sure PORT is set to 10000 (Render default)

### 4. Advanced Settings
- **Auto-Deploy**: Yes
- **Health Check Path**: /
- **Region**: Choose closest to your users

## Database Setup
Your Neon database is already configured and will work immediately with Render.

## Post-Deployment
1. Update Firebase Authorized Domains with your Render URL
2. Test Google authentication
3. Verify all features working

Your application will be available at: https://mohit-corporation.onrender.com