import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Database URL - check if we can get current password from Neon
const DATABASE_URL = process.env.DATABASE_URL || 
  process.env.PGUSER && process.env.PGPASSWORD ? 
    `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require` :
    "postgresql://mohit_owner:npg_47yoWupTxNBs@ep-gentle-glade-a8imzvfp-pooler.eastus2.azure.neon.tech/mohit?sslmode=require";

console.log("🗄️ Database connection:", DATABASE_URL ? "✅ Connected" : "❌ No URL provided");

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });