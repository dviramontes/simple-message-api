import { Pool } from "pg";

const connectionString =
  "postgresql://postgres:postgres@localhost:5432/messages";

export const pool = new Pool({
  connectionString,
});

export async function pingDatabase() {
  const client = await pool.connect();
  const {
    rows: [{ now }],
  } = await client.query("SELECT NOW()");
  console.log(`-- established db connection: ${now}`);
  client.release();
}
