import { Pool } from "pg";
import sql from "sql-template-strings";

const connectionString =
  "postgresql://postgres:postgres@localhost:5432/messages";

export const pool = new Pool({
  connectionString,
});

export async function pingDatabase() {
  const client = await pool.connect();
  const {
    rows: [{ now }],
  } = await client.query(sql`SELECT NOW()`);
  console.log(`-- established db connection: ${now}`);
  client.release();
}

export async function resetDB() {
  console.log("-- resetting db");

  const client = await pool.connect();

  await client.query(sql`DROP TABLE IF EXISTS users`);
  await client.query(sql`DROP TABLE IF EXISTS messages`);
  await client.query(sql`DROP TABLE IF EXISTS convos`);
  await client.query(sql`DROP TABLE IF EXISTS user_convos`);

  await client.query(sql`
    CREATE TABLE convos(
        id SERIAL PRIMARY KEY
    );
  `);

  await client.query(sql`
      CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(255) UNIQUE NOT NULL
      );
  `);

  await client.query(sql`
      CREATE TABLE messages(
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        send_by_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        convo_id INTEGER NOT NULL REFERENCES convos(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP NOT NULL DEFAULT now()
      );
  `);

  await client.query(sql`
    CREATE TABLE user_convos(
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        convo_id INTEGER NOT NULL REFERENCES convos(id) ON DELETE CASCADE
    );
  `);

  await pool.query(
    sql`GRANT ALL PRIVILEGES  ON ALL TABLES IN SCHEMA public to postgres;`
  );

  await client.release();
}
