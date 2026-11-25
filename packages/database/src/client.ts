import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

type DbClient = ReturnType<typeof postgres>;
type Database = ReturnType<typeof drizzle<typeof schema>>;

let client: DbClient | undefined;
let database: Database | undefined;

/** Lazy connection: importing this package must not open a database socket. */
export function getDb(): Database {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured.');
  if (!client) client = postgres(url, { max: 5, prepare: false });
  if (!database) database = drizzle(client, { schema });
  return database;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export async function closeDb(): Promise<void> {
  if (client) await client.end();
  client = undefined;
  database = undefined;
}

export { schema };
