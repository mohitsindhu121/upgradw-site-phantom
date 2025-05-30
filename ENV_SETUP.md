# Environment Variables Setup Guide

## Required Environment Variables

Copy the values from your current Replit secrets and set these variables in any deployment platform:

### Database Configuration
```env
DATABASE_URL=postgresql://mohit_owner:npg_47yoWupTxNBs@ep-gentle-glade-a8imzvfp-pooler.eastus2.azure.neon.tech/mohit?sslmode=require
PGHOST=ep-gentle-glade-a8imzvfp-pooler.eastus2.azure.neon.tech
PGPORT=5432
PGUSER=mohit_owner
PGPASSWORD=npg_47yoWupTxNBs
PGDATABASE=mohit
```

### Firebase Configuration (Google Authentication)
```env
VITE_FIREBASE_API_KEY=[Your Firebase API Key]
VITE_FIREBASE_PROJECT_ID=[Your Firebase Project ID]
VITE_FIREBASE_APP_ID=[Your Firebase App ID]
```

### Application Configuration
```env
NODE_ENV=production
PORT=5000
SESSION_SECRET=mohit-corp-secret-2024
```

## Platform-Specific Setup

### Vercel
1. Go to Project Settings → Environment Variables
2. Add all variables above
3. Deploy from GitHub

### Netlify
1. Site settings → Environment variables
2. Add all variables
3. Deploy

### Railway/Render
1. Environment tab
2. Add variables
3. Deploy

## Your Current Database
- **Permanent**: Yes, data will persist
- **Storage**: 1GB+ available on free tier
- **Backup**: Schema exported in `database-backup.sql`
- **Migration**: Use provided SQL file for new databases

## Security Notes
- All credentials are secured
- Database URL contains authentication
- Firebase keys are for frontend authentication only
- No additional API keys needed for core functionality

Your application is ready for production deployment with these settings.