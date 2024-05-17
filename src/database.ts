import { open } from "sqlite";
import { Database } from "sqlite3";

const dbPromise = open({
  filename: "./data.db",
  driver: Database
});

async function setup() {
  const db = await dbPromise;
  await db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    username TEXT
  )`);
}

export { dbPromise, setup };