import * as Knex from "knex";
import { TableBuilder } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("messages", (table: TableBuilder) => {
    table.increments("id");
    table.text("content").notNullable();

    table
      .integer("send_by_id")
      .unsigned()
      .references("users.id")
      .onDelete("CASCADE");

    table
      .integer("chat_id")
      .unsigned()
      .references("chats.id")
      .onDelete("CASCADE");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("messages");
}
