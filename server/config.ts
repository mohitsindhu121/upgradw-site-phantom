// Environment Configuration
// This file handles all environment variables and provides defaults

export const config = {
  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || '',
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER || '',
    password: process.env.PGPASSWORD || '',
    name: process.env.PGDATABASE || ''
  },
  
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '5000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    sessionSecret: process.env.SESSION_SECRET || 'mohit-corp-secret-key-2024'
  },
  
  // Firebase Configuration (for Google Auth)
  firebase: {
    apiKey: process.env.VITE_FIREBASE_API_KEY || '',
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
    appId: process.env.VITE_FIREBASE_APP_ID || ''
  },
  
  // AI Services Configuration
  ai: {
    openaiKey: process.env.OPENAI_API_KEY || '',
    groqKey: process.env.GROQ_API_KEY || ''
  },
  
  // Application URLs
  urls: {
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5000',
    serverUrl: process.env.SERVER_URL || 'http://localhost:5000'
  }
};

// Validation function
export function validateConfig() {
  const required = [
    'DATABASE_URL',
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables:', missing.join(', '));
    console.warn('⚠️  Application may not work properly without these variables');
  }
  
  return missing.length === 0;
}