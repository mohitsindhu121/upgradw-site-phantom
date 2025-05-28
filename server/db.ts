import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Custom database URL (you can change this to your own database)
const DATABASE_URL = process.env.DATABASE_URL || 
  process.env.CUSTOM_DATABASE_URL || 
  "postgresql://username:password@hostname:port/database";

console.log("🗄️ Database connection:", DATABASE_URL ? "✅ Connected" : "❌ No URL provided");

if (!DATABASE_URL) {
  console.error("⚠️ Please set DATABASE_URL or CUSTOM_DATABASE_URL environment variable");
  throw new Error("Database URL is required. Please set DATABASE_URL or CUSTOM_DATABASE_URL environment variable.");
}

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });