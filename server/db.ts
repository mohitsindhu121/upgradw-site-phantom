import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Database URL - directly using your Neon database
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://mohit_owner:npg_47yoWupTxNBs@ep-gentle-glade-a8imzvfp-pooler.eastus2.azure.neon.tech/mohit?sslmode=require";

console.log("🗄️ Database connection:", DATABASE_URL ? "✅ Connected" : "❌ No URL provided");

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });