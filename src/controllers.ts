import { pool } from "./db";
import { ok, err } from "neverthrow";
import sql from "sql-template-strings";

export async function allMessagesController() {
  let result = null;
  const client = await pool.connect();
  try {
    const queryResults = await client.query(
      sql`
          SELECT messages.*,
           (SELECT user_id FROM user_convos 
            WHERE convo_id = messages.convo_id AND user_id <> messages.send_by_id) AS sent_to_id
          FROM messages
          WHERE messages.created_at > (now() - '30 days'::INTERVAL)
          LIMIT 100;
      `
    );
    result = queryResults.rows;
  } catch (error) {
    return err(error.detail);
  } finally {
    await client.release();
  }

  return ok(result);
}

export async function createMessage(
  convoId: number,
  sendById: number,
  content: string
) {
  let result = null;
  const client = await pool.connect();

  try {
    await client.query(sql`BEGIN`);

    const preparedStatement = sql`
      INSERT INTO messages(convo_id, send_by_id, content)
      VALUES($1, $2, $3)
    `;
    const insertResult = await client.query(preparedStatement, [
      +convoId,
      +sendById,
      content,
    ]);

    await client.query(sql`COMMIT`);

    result = insertResult.rowCount;
  } catch (error) {
    await client.query(sql`ROLLBACK`);
    return err(error.detail);
  } finally {
    await client.release();
  }

  return ok(result);
}

export async function getMessage(id: number) {
  let result = null;
  const client = await pool.connect();

  try {
    const preparedStatement = sql`SELECT * FROM messages where id = $1`;
    const query = await client.query(preparedStatement, [id]);

    result = query.rows[0];
  } catch (error) {
    return err(error.detail);
  } finally {
    await client.release();
  }

  return ok(result);
}

export async function getOrCreateUser(uuid: string) {
  let result = null;
  const client = await pool.connect();

  try {
    await client.query(sql`BEGIN`);

    const preparedStatement = sql`INSERT INTO users(uuid) VALUES ($1) RETURNING *`;
    const createTransaction = await client.query(preparedStatement, [uuid]);
    if (createTransaction.rowCount === 1) {
      await client.query(sql`COMMIT`);

      result = createTransaction.rows[0];
    }
  } catch (error) {
    await client.query(sql`ROLLBACK`);
    if (/already exists/.test(error.detail)) {
      const lookupResult = await getUserByUUID(uuid);
      if (lookupResult.isOk()) {
        result = lookupResult.value;
      }
    } else {
      return err(error.detail);
    }
  } finally {
    await client.release();
  }

  return ok(result);
}

export async function getUserByUUID(uuid: string) {
  let result = null;
  const client = await pool.connect();

  try {
    const preparedStatement = sql`SELECT * FROM users where uuid = $1`;
    const query = await client.query(preparedStatement, [uuid]);
    if (query.rowCount === 1) {
      result = query.rows[0];
    }
  } catch (error) {
    return err(error.detail);
  } finally {
    await client.release();
  }

  return ok(result);
}

export async function getUserById(id: number) {
  let result = null;
  const client = await pool.connect();

  try {
    const preparedStatement = sql`SELECT * FROM users where id = $1`;
    const query = await client.query(preparedStatement, [id]);
    result = query.rows[0];
  } catch (error) {
    return err(error.detail);
  } finally {
    await client.release();
  }

  return ok(result);
}

export async function getconvoById(id: number) {
  let result = {};
  const client = await pool.connect();

  try {
    const preparedStatement = sql`SELECT id FROM convos where id = $1`;
    const query = await client.query(preparedStatement, [id]);
    if (query.rowCount > 0) {
      result = query.rows[0];
    }
  } catch (error) {
    return err(error.detail);
  } finally {
    await client.release();
  }

  return ok(result);
}

export async function convoExists(userId: number, recipientId: number) {
  let result = null;
  const client = await pool.connect();
  try {
    const query = await client.query(sql`
      SELECT convos.* FROM convos, 
        (SELECT * FROM user_convos WHERE user_id = ${+userId}) AS uc, 
        user_convos
      WHERE user_convos.convo_id = uc.convo_id
        AND convos.id = user_convos.convo_id
        AND user_convos.user_id = ${+recipientId}
    `);
    if (query.rowCount > 0) {
      result = query.rows[0];
    }
  } catch (error) {
    return err(error.detail);
  } finally {
    await client.release();
  }

  return ok(result);
}

export async function createConvo(userId: number, recipientId: number) {
  let result = null;
  const client = await pool.connect();
  try {
    await client.query(sql`BEGIN`);
    const convoTx = sql`INSERT INTO convos DEFAULT VALUES RETURNING id`;
    const {
      rows: [{ id }],
    } = await client.query(convoTx);

    await client.query(sql`
      INSERT INTO user_convos(user_id, convo_id)
      VALUES(${userId}, ${id})
    `);

    await client.query(sql`
      INSERT INTO user_convos(user_id, convo_id)
      VALUES(${recipientId}, ${id})
    `);

    await client.query(sql`COMMIT`);

    result = { id };
  } catch (error) {
    await client.query(sql`ROLLBACK`);
    return err(error.detail);
  } finally {
    await client.release();
  }

  return ok(result);
}
