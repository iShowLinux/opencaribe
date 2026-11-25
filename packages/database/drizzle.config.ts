import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://opencaribe:opencaribe@localhost:5432/opencaribe',
  },
  verbose: true,
  strict: true,
});
