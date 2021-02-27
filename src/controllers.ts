import { pool } from "./db";
import { ok, err } from "neverthrow";

export async function allMessagesController() {
  let result = null;
  const client = await pool.connect();
  try {
    // TODO: add 100 msg limit
    // TODO: add < 30 day limit
    const queryResults = await client.query(
      `
        SELECT u.uuid, m.content from user_messages
        JOIN users as u on u.id = user_id
        JOIN messages as m on m.id = message_id;
    `
    );
    result = queryResults.rows;
  } catch (e) {
    return err(new Error(e.message));
  } finally {
    await client.release();
  }

  return ok(result);
}

export async function createMessageController(uuid: string, content: string, recipientId: number, senderId: number) {
  let result = null;
  const client = await pool.connect();
  try {
    const insertResult = await client.query(
      `
      
      
      
    `
    );
    console.log(insertResult);
    result = insertResult.rows;
  } catch (e) {
    return err(new Error(e.message));
  } finally {
    await client.release();
  }

  return ok(result);
}
