import { Pool } from "pg";
import sql from "sql-template-strings";

const connectionString =
  "postgresql://postgres:postgres@localhost:5432/messages";
const tesConnectionString =
  "postgresql://postgres:postgres@localhost:5432/messages-test";

export const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "test" ? tesConnectionString : connectionString,
});

export async function pingDatabase(): Promise<void> {
  const client = await pool.connect();
  const {
    rows: [{ now }],
  } = await client.query(sql`SELECT NOW()`);
  console.log(`-- established db connection: ${now}`);
  client.release();
}

export async function resetDB(): Promise<void> {
  console.log("-- resetting db");

  const client = await pool.connect();

  await client.query(sql`DROP TABLE IF EXISTS users`);
  await client.query(sql`DROP TABLE IF EXISTS messages`);
  await client.query(sql`DROP TABLE IF EXISTS chats`);
  await client.query(sql`DROP TABLE IF EXISTS user_chats`);

  await client.query(sql`
    CREATE TABLE chats(
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
        chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP NOT NULL DEFAULT now()
      );
  `);

  await client.query(sql`
    CREATE TABLE user_chats(
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE
    );
  `);

  await pool.query(
    sql`GRANT ALL PRIVILEGES  ON ALL TABLES IN SCHEMA public to postgres;`
  );

  await client.release();
}
