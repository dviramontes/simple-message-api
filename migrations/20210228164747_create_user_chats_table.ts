import * as Knex from "knex";
import { TableBuilder } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_chats", (table: TableBuilder) => {
    table
      .integer("user_id")
      .unsigned()
      .references("users.id")
      .onDelete("CASCADE");

    table
      .integer("chat_id")
      .unsigned()
      .references("chats.id")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("user_chats");
}
