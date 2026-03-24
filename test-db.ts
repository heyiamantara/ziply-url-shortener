import 'dotenv/config';
import { db } from './src/server/db/index.js';
import { users } from './src/server/db/schema.js';

async function main() {
  try {
    const result = await db.select().from(users).limit(1);
    console.log("DB connection successful, users:", result);
  } catch (error) {
    console.error("DB connection/query failed:", error);
  }
  process.exit(0);
}

main();
