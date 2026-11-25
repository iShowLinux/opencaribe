import { closeDb, getDb, schema } from '@opencaribe/database';
import { buildGeographySeed } from './index';

async function main() {
  const seed = buildGeographySeed();
  const db = getDb();
  await db.insert(schema.geographyRegions).values(seed.regions).onConflictDoNothing();
  await db.insert(schema.geographyCities).values(seed.cities).onConflictDoNothing();
  console.log(`Seeded ${seed.regions.length} regions and ${seed.cities.length} cities.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });
