import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use the environment DATABASE_URL which has the correct credentials
const DATABASE_URL = process.env.DATABASE_URL;

console.log("🗄️ Database connection:", DATABASE_URL ? "✅ Connected" : "❌ No URL provided");

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });