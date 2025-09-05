import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

// Only initialize database connection if DATABASE_URL is available
// This prevents errors during build time when env vars are not available
const databaseUrl = process.env.DATABASE_URL;
export const db = databaseUrl ? drizzle(databaseUrl, { schema }) : null;